import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { Errors } from '@/lib/api-response';
import {
    exchangeCodeForToken,
    fetchLinkedInProfile,
    linkLinkedInAccount,
    parseOAuthState,
} from '@/lib/linkedin-verify';
import mongoose from 'mongoose';

// GET /api/auth/linkedin/callback - Handle LinkedIn OAuth callback
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors
        if (error) {
            console.error('LinkedIn OAuth error:', error, errorDescription);
            // Redirect to error page
            const errorUrl = new URL('/verify/error', request.url);
            errorUrl.searchParams.set('error', error);
            errorUrl.searchParams.set('message', errorDescription || 'LinkedIn authentication failed');
            return NextResponse.redirect(errorUrl);
        }

        // Validate required parameters
        if (!code || !state) {
            const errorUrl = new URL('/verify/error', request.url);
            errorUrl.searchParams.set('error', 'invalid_request');
            errorUrl.searchParams.set('message', 'Missing authorization code or state');
            return NextResponse.redirect(errorUrl);
        }

        // Parse and validate state
        const stateData = parseOAuthState(state);
        if (!stateData) {
            const errorUrl = new URL('/verify/error', request.url);
            errorUrl.searchParams.set('error', 'invalid_state');
            errorUrl.searchParams.set('message', 'Invalid or expired state parameter');
            return NextResponse.redirect(errorUrl);
        }

        const { userId, reviewId } = stateData;

        // Exchange code for tokens
        const tokenResponse = await exchangeCodeForToken(code);

        // Fetch LinkedIn profile
        const profile = await fetchLinkedInProfile(tokenResponse.access_token);

        // Link account to user
        await linkLinkedInAccount(
            new mongoose.Types.ObjectId(userId),
            tokenResponse,
            profile
        );

        // If this was for a specific review, mark it as verified
        if (reviewId) {
            await Review.findByIdAndUpdate(reviewId, {
                verified: true,
                verifiedAt: new Date(),
            });
        }

        // Redirect to success page
        const successUrl = new URL('/verify/success', request.url);
        successUrl.searchParams.set('provider', 'linkedin');
        if (reviewId) {
            successUrl.searchParams.set('reviewId', reviewId);
        }
        return NextResponse.redirect(successUrl);
    } catch (error) {
        console.error('Error in LinkedIn callback:', error);
        const errorUrl = new URL('/verify/error', request.url);
        errorUrl.searchParams.set('error', 'server_error');
        errorUrl.searchParams.set(
            'message',
            error instanceof Error ? error.message : 'An unexpected error occurred'
        );
        return NextResponse.redirect(errorUrl);
    }
}
