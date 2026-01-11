import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { successResponse, Errors } from '@/lib/api-response';
import { checkLinkedInVerification, generateAuthorizationUrl, generateOAuthState } from '@/lib/linkedin-verify';
import mongoose from 'mongoose';

// POST /api/reviews/[id]/linkedin-verify - Verify review author via LinkedIn
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Errors.NOT_FOUND('Review');
        }

        // Find the review
        const review = await Review.findById(id);

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        // Check if already verified
        if (review.verified) {
            return successResponse({
                reviewId: id,
                status: 'already_verified',
                verified: true,
                verifiedAt: review.verifiedAt,
                message: 'This review is already verified via LinkedIn',
            });
        }

        // Check if the author has LinkedIn linked
        const verificationStatus = await checkLinkedInVerification(review.authorId);

        if (verificationStatus.verified) {
            // User has valid LinkedIn, verify the review
            review.verified = true;
            review.verifiedAt = new Date();
            await review.save();

            return successResponse({
                reviewId: id,
                status: 'verified',
                verified: true,
                verifiedAt: review.verifiedAt,
                linkedinProfile: {
                    name: verificationStatus.profileName,
                    image: verificationStatus.profileImage,
                },
                message: 'Review has been verified via LinkedIn identity',
            });
        } else {
            // User needs to authenticate with LinkedIn
            const state = generateOAuthState(review.authorId.toString(), id);
            const authUrl = generateAuthorizationUrl(state);

            return successResponse({
                reviewId: id,
                status: 'verification_required',
                verified: false,
                authorizationUrl: authUrl,
                message: 'LinkedIn authentication required to verify this review',
                reason: verificationStatus.error,
            });
        }
    } catch (error) {
        console.error('Error verifying review via LinkedIn:', error);
        return Errors.SERVER_ERROR('Failed to verify review');
    }
}

// GET /api/reviews/[id]/linkedin-verify - Get LinkedIn verification status for a review
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Errors.NOT_FOUND('Review');
        }

        const review = await Review.findById(id);

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        if (review.verified) {
            // Get author's LinkedIn info if available
            const verificationStatus = await checkLinkedInVerification(review.authorId);

            return successResponse({
                reviewId: id,
                verified: true,
                verifiedAt: review.verifiedAt,
                linkedinProfile: verificationStatus.verified
                    ? {
                        name: verificationStatus.profileName,
                        image: verificationStatus.profileImage,
                    }
                    : null,
            });
        } else {
            return successResponse({
                reviewId: id,
                verified: false,
                message: 'Review has not been verified via LinkedIn',
            });
        }
    } catch (error) {
        console.error('Error getting LinkedIn verification status:', error);
        return Errors.SERVER_ERROR('Failed to get verification status');
    }
}
