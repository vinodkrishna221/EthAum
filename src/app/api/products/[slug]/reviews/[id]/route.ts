import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { successResponse, Errors } from '@/lib/api-response';
import mongoose from 'mongoose';

// GET /api/products/[slug]/reviews/[id] - Get single review
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string; id: string } }
) {
    try {
        await dbConnect();

        const { slug, id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Errors.NOT_FOUND('Review');
        }

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return Errors.NOT_FOUND('Product');
        }

        // Find the review
        const review = await Review.findOne({
            _id: id,
            productId: product._id,
        }).populate('authorId', 'name image');

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        return successResponse({
            id: review._id.toString(),
            rating: review.rating,
            title: review.title,
            content: review.content,
            pros: review.pros,
            cons: review.cons,
            videoUrl: review.videoUrl,
            verified: review.verified,
            verifiedAt: review.verifiedAt,
            status: review.status,
            helpfulCount: review.helpfulCount,
            author: review.authorId
                ? {
                    id: (review.authorId as { _id: mongoose.Types.ObjectId })._id.toString(),
                    name: (review.authorId as { name?: string }).name,
                    image: (review.authorId as { image?: string }).image,
                }
                : null,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        return Errors.SERVER_ERROR('Failed to fetch review');
    }
}

// PUT /api/products/[slug]/reviews/[id] - Update review (author only)
export async function PUT(
    request: NextRequest,
    { params }: { params: { slug: string; id: string } }
) {
    try {
        await dbConnect();

        const { slug, id } = params;
        const body = await request.json();

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Errors.NOT_FOUND('Review');
        }

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return Errors.NOT_FOUND('Product');
        }

        // Find the review
        const review = await Review.findOne({
            _id: id,
            productId: product._id,
        });

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        // TODO: Verify the requesting user is the author
        // In production, compare session user ID with review.authorId
        if (body.authorId && body.authorId !== review.authorId.toString()) {
            return Errors.FORBIDDEN();
        }

        // Validate fields if provided
        const validationErrors: Array<{ field: string; message: string }> = [];

        if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
            validationErrors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
        }

        if (body.content !== undefined && body.content.trim().length < 10) {
            validationErrors.push({ field: 'content', message: 'Review content must be at least 10 characters' });
        }

        if (validationErrors.length > 0) {
            return Errors.VALIDATION_ERROR(validationErrors);
        }

        // Update allowed fields
        const allowedUpdates = ['rating', 'title', 'content', 'pros', 'cons', 'videoUrl'];
        const updates: Record<string, unknown> = {};

        for (const field of allowedUpdates) {
            if (body[field] !== undefined) {
                updates[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
            }
        }

        // If content was updated, reset to pending for re-moderation
        if (updates.content || updates.rating) {
            updates.status = 'PENDING';
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).populate('authorId', 'name image');

        return successResponse({
            id: updatedReview!._id.toString(),
            rating: updatedReview!.rating,
            title: updatedReview!.title,
            content: updatedReview!.content,
            pros: updatedReview!.pros,
            cons: updatedReview!.cons,
            videoUrl: updatedReview!.videoUrl,
            verified: updatedReview!.verified,
            status: updatedReview!.status,
            updatedAt: updatedReview!.updatedAt,
        });
    } catch (error) {
        console.error('Error updating review:', error);
        return Errors.SERVER_ERROR('Failed to update review');
    }
}

// DELETE /api/products/[slug]/reviews/[id] - Delete review (author or admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string; id: string } }
) {
    try {
        await dbConnect();

        const { slug, id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Errors.NOT_FOUND('Review');
        }

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return Errors.NOT_FOUND('Product');
        }

        // Find the review
        const review = await Review.findOne({
            _id: id,
            productId: product._id,
        });

        if (!review) {
            return Errors.NOT_FOUND('Review');
        }

        // TODO: Verify the requesting user is the author or an admin
        // In production, check session user ID or admin role
        // For now, we'll require authorId in the request for verification
        const { searchParams } = new URL(request.url);
        const requestingUserId = searchParams.get('userId');

        if (requestingUserId && requestingUserId !== review.authorId.toString()) {
            // TODO: Also check if user is admin
            return Errors.FORBIDDEN();
        }

        await Review.findByIdAndDelete(id);

        return successResponse({ deleted: true, id });
    } catch (error) {
        console.error('Error deleting review:', error);
        return Errors.SERVER_ERROR('Failed to delete review');
    }
}
