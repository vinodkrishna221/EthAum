import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { successResponse, Errors } from '@/lib/api-response';
import { verifyReview, shouldAutoApprove, shouldAutoReject } from '@/lib/review-verification';
import mongoose from 'mongoose';

// POST /api/reviews/[id]/verify - Trigger AI verification for a review
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

        // TODO: Verify the requesting user is an admin
        // In production, check session user role

        // Find the review
        const review = await Review.findById(id);

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        // Run verification
        const verificationResult = verifyReview(
            review.content,
            review.title,
            review.pros,
            review.cons,
            review.rating
        );

        // Determine new status based on verification
        let newStatus = review.status;
        let statusReason = 'Manual review required';

        if (shouldAutoApprove(verificationResult)) {
            newStatus = 'APPROVED';
            statusReason = 'Auto-approved based on high confidence score';
        } else if (shouldAutoReject(verificationResult)) {
            newStatus = 'REJECTED';
            statusReason = 'Auto-rejected due to spam detection';
        }

        // Update review if status changed
        if (newStatus !== review.status) {
            review.status = newStatus;
            await review.save();
        }

        return successResponse({
            reviewId: id,
            verification: {
                isAuthentic: verificationResult.isAuthentic,
                confidenceScore: verificationResult.confidenceScore,
                flags: verificationResult.flags,
                checks: {
                    contentQuality: {
                        passed: verificationResult.checks.contentQuality.passed,
                        score: verificationResult.checks.contentQuality.score,
                        details: verificationResult.checks.contentQuality.details,
                    },
                    spamDetection: {
                        passed: verificationResult.checks.spamDetection.passed,
                        score: verificationResult.checks.spamDetection.score,
                        details: verificationResult.checks.spamDetection.details,
                    },
                    authenticityScore: {
                        passed: verificationResult.checks.authenticityScore.passed,
                        score: verificationResult.checks.authenticityScore.score,
                        details: verificationResult.checks.authenticityScore.details,
                    },
                },
            },
            status: {
                previous: review.status === newStatus ? review.status : undefined,
                current: newStatus,
                reason: statusReason,
            },
        });
    } catch (error) {
        console.error('Error verifying review:', error);
        return Errors.SERVER_ERROR('Failed to verify review');
    }
}

// GET /api/reviews/[id]/verify - Get verification status without running verification
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

        // Run verification without updating
        const verificationResult = verifyReview(
            review.content,
            review.title,
            review.pros,
            review.cons,
            review.rating
        );

        return successResponse({
            reviewId: id,
            currentStatus: review.status,
            verification: {
                isAuthentic: verificationResult.isAuthentic,
                confidenceScore: verificationResult.confidenceScore,
                flags: verificationResult.flags,
                recommendation: shouldAutoApprove(verificationResult)
                    ? 'APPROVE'
                    : shouldAutoReject(verificationResult)
                        ? 'REJECT'
                        : 'MANUAL_REVIEW',
            },
        });
    } catch (error) {
        console.error('Error getting verification status:', error);
        return Errors.SERVER_ERROR('Failed to get verification status');
    }
}
