/**
 * LinkedIn Identity Verification Service
 * 
 * Handles LinkedIn OAuth flow for verifying reviewer identity.
 * Uses LinkedIn's OpenID Connect implementation.
 */

import Account from '@/models/Account';
import User from '@/models/User';
import mongoose from 'mongoose';

// LinkedIn OAuth Configuration
const LINKEDIN_CONFIG = {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/api/auth/linkedin/callback',
    scope: 'openid profile email',
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
};

export interface LinkedInProfile {
    sub: string; // LinkedIn member ID
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    email?: string;
    email_verified?: boolean;
}

export interface LinkedInTokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token?: string;
}

export interface VerificationStatus {
    verified: boolean;
    linkedinId?: string;
    profileName?: string;
    profileImage?: string;
    verifiedAt?: Date;
    error?: string;
}

/**
 * Generate LinkedIn OAuth authorization URL
 */
export function generateAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: LINKEDIN_CONFIG.clientId,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
        scope: LINKEDIN_CONFIG.scope,
        state: state,
    });

    return `${LINKEDIN_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<LinkedInTokenResponse> {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: LINKEDIN_CONFIG.clientId,
        client_secret: LINKEDIN_CONFIG.clientSecret,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
    });

    const response = await fetch(LINKEDIN_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn token exchange failed: ${error}`);
    }

    return response.json();
}

/**
 * Fetch LinkedIn user profile using access token
 */
export async function fetchLinkedInProfile(accessToken: string): Promise<LinkedInProfile> {
    const response = await fetch(LINKEDIN_CONFIG.userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn profile fetch failed: ${error}`);
    }

    return response.json();
}

/**
 * Link LinkedIn account to user
 */
export async function linkLinkedInAccount(
    userId: mongoose.Types.ObjectId,
    tokenResponse: LinkedInTokenResponse,
    profile: LinkedInProfile
): Promise<void> {
    // Check if this LinkedIn account is already linked to another user
    const existingAccount = await Account.findOne({
        provider: 'linkedin',
        providerAccountId: profile.sub,
    });

    if (existingAccount && existingAccount.userId.toString() !== userId.toString()) {
        throw new Error('This LinkedIn account is already linked to another user');
    }

    // Upsert the account
    await Account.findOneAndUpdate(
        {
            userId: userId,
            provider: 'linkedin',
        },
        {
            userId: userId,
            type: 'oauth',
            provider: 'linkedin',
            providerAccountId: profile.sub,
            access_token: tokenResponse.access_token,
            expires_at: Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
            token_type: tokenResponse.token_type,
            scope: tokenResponse.scope,
            id_token: tokenResponse.id_token,
        },
        { upsert: true, new: true }
    );

    // Update user profile with LinkedIn info if not already set
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                linkedinUrl: `https://www.linkedin.com/in/${profile.sub}`,
                ...(profile.name && !await User.findById(userId).then(u => u?.name) ? { name: profile.name } : {}),
                ...(profile.picture && !await User.findById(userId).then(u => u?.image) ? { image: profile.picture } : {}),
            },
        }
    );
}

/**
 * Check if a user has verified their LinkedIn identity
 */
export async function checkLinkedInVerification(userId: mongoose.Types.ObjectId): Promise<VerificationStatus> {
    const account = await Account.findOne({
        userId: userId,
        provider: 'linkedin',
    });

    if (!account) {
        return {
            verified: false,
            error: 'No LinkedIn account linked',
        };
    }

    // Check if token is expired
    const isExpired = account.expires_at && account.expires_at < Math.floor(Date.now() / 1000);

    if (isExpired) {
        return {
            verified: false,
            linkedinId: account.providerAccountId,
            error: 'LinkedIn token expired, re-authentication required',
        };
    }

    // Try to fetch current profile to verify the account is still valid
    try {
        const profile = await fetchLinkedInProfile(account.access_token!);

        return {
            verified: true,
            linkedinId: profile.sub,
            profileName: profile.name,
            profileImage: profile.picture,
            verifiedAt: account.updatedAt,
        };
    } catch {
        return {
            verified: false,
            linkedinId: account.providerAccountId,
            error: 'Unable to verify LinkedIn account, re-authentication may be required',
        };
    }
}

/**
 * Generate a secure state parameter for OAuth
 */
export function generateOAuthState(userId: string, reviewId?: string): string {
    const payload = {
        userId,
        reviewId,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(2, 15),
    };

    // In production, this should be encrypted/signed
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Parse OAuth state parameter
 */
export function parseOAuthState(state: string): { userId: string; reviewId?: string; timestamp: number } | null {
    try {
        const decoded = Buffer.from(state, 'base64url').toString('utf-8');
        const payload = JSON.parse(decoded);

        // Check if state is not expired (15 minutes)
        if (Date.now() - payload.timestamp > 15 * 60 * 1000) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
