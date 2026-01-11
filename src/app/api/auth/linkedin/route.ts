import { NextRequest } from 'next/server';
import { successResponse, Errors } from '@/lib/api-response';
import { generateAuthorizationUrl, generateOAuthState } from '@/lib/linkedin-verify';

// GET /api/auth/linkedin - Initiate LinkedIn OAuth flow
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const reviewId = searchParams.get('reviewId');

        if (!userId) {
            return Errors.VALIDATION_ERROR([
                { field: 'userId', message: 'User ID is required to initiate LinkedIn verification' },
            ]);
        }

        // Generate state parameter with user context
        const state = generateOAuthState(userId, reviewId || undefined);

        // Generate authorization URL
        const authUrl = generateAuthorizationUrl(state);

        return successResponse({
            authorizationUrl: authUrl,
            message: 'Redirect user to this URL to begin LinkedIn verification',
        });
    } catch (error) {
        console.error('Error initiating LinkedIn auth:', error);
        return Errors.SERVER_ERROR('Failed to initiate LinkedIn authentication');
    }
}

// POST /api/auth/linkedin - Alternative for clients that prefer POST
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, reviewId } = body;

        if (!userId) {
            return Errors.VALIDATION_ERROR([
                { field: 'userId', message: 'User ID is required to initiate LinkedIn verification' },
            ]);
        }

        // Generate state parameter with user context
        const state = generateOAuthState(userId, reviewId);

        // Generate authorization URL
        const authUrl = generateAuthorizationUrl(state);

        return successResponse({
            authorizationUrl: authUrl,
            message: 'Redirect user to this URL to begin LinkedIn verification',
        });
    } catch (error) {
        console.error('Error initiating LinkedIn auth:', error);
        return Errors.SERVER_ERROR('Failed to initiate LinkedIn authentication');
    }
}
