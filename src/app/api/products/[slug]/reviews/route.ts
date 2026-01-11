import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review, { IReview } from '@/models/Review';
import Product from '@/models/Product';
import { successResponse, Errors } from '@/lib/api-response';
import mongoose from 'mongoose';

interface ReviewQuery {
    productId: mongoose.Types.ObjectId;
    status?: string;
    verified?: boolean;
    rating?: number;
}

type SortOption = 'recent' | 'helpful' | 'rating_high' | 'rating_low';

function getSortOption(sort: SortOption) {
    switch (sort) {
        case 'helpful':
            return { helpfulCount: -1, createdAt: -1 };
        case 'rating_high':
            return { rating: -1, createdAt: -1 };
        case 'rating_low':
            return { rating: 1, createdAt: -1 };
        case 'recent':
        default:
            return { createdAt: -1 };
    }
}

// GET /api/products/[slug]/reviews - List reviews with filters
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();

        const { slug } = params;
        const { searchParams } = new URL(request.url);

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return Errors.NOT_FOUND('Product');
        }

        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
        const sort = (searchParams.get('sort') || 'recent') as SortOption;
        const verifiedOnly = searchParams.get('verified') === 'true';
        const ratingFilter = searchParams.get('rating');

        // Build query
        const query: ReviewQuery = {
            productId: product._id,
            status: 'APPROVED', // Only show approved reviews publicly
        };

        if (verifiedOnly) {
            query.verified = true;
        }

        if (ratingFilter) {
            const rating = parseInt(ratingFilter, 10);
            if (rating >= 1 && rating <= 5) {
                query.rating = rating;
            }
        }

        // Execute queries in parallel
        const [reviews, total, ratingAggregation] = await Promise.all([
            Review.find(query)
                .sort(getSortOption(sort))
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('authorId', 'name image')
                .lean(),
            Review.countDocuments(query),
            Review.aggregate([
                { $match: { productId: product._id, status: 'APPROVED' } },
                {
                    $group: {
                        _id: '$rating',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        // Calculate rating distribution
        const distribution: Record<string, number> = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
        let totalRatings = 0;
        let sumRatings = 0;

        ratingAggregation.forEach((item: { _id: number; count: number }) => {
            distribution[item._id.toString()] = item.count;
            totalRatings += item.count;
            sumRatings += item._id * item.count;
        });

        const averageRating = totalRatings > 0 ? Math.round((sumRatings / totalRatings) * 10) / 10 : 0;

        // Transform reviews for response
        const formattedReviews = reviews.map((review) => ({
            id: review._id.toString(),
            rating: review.rating,
            title: review.title,
            content: review.content,
            pros: review.pros,
            cons: review.cons,
            videoUrl: review.videoUrl,
            verified: review.verified,
            author: review.authorId
                ? {
                    name: (review.authorId as { name?: string; image?: string }).name,
                    image: (review.authorId as { name?: string; image?: string }).image,
                    verified: review.verified,
                }
                : null,
            helpfulCount: review.helpfulCount,
            createdAt: review.createdAt,
        }));

        return successResponse(formattedReviews, {
            page,
            limit,
            total,
            hasMore: page * limit < total,
            averageRating,
            distribution,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return Errors.SERVER_ERROR('Failed to fetch reviews');
    }
}

// POST /api/products/[slug]/reviews - Submit a new review
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();

        const { slug } = params;

        // TODO: Get authenticated user from session
        // For now, we'll expect authorId in the request body
        // In production, this should come from the auth session
        const body = await request.json();

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return Errors.NOT_FOUND('Product');
        }

        // Validate required fields
        const validationErrors: Array<{ field: string; message: string }> = [];

        if (!body.rating || body.rating < 1 || body.rating > 5) {
            validationErrors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
        }

        if (!body.content || body.content.trim().length < 10) {
            validationErrors.push({ field: 'content', message: 'Review content must be at least 10 characters' });
        }

        if (!body.authorId) {
            validationErrors.push({ field: 'authorId', message: 'Author ID is required' });
        }

        if (validationErrors.length > 0) {
            return Errors.VALIDATION_ERROR(validationErrors);
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            productId: product._id,
            authorId: body.authorId,
        });

        if (existingReview) {
            return Errors.VALIDATION_ERROR([
                { field: 'authorId', message: 'You have already reviewed this product' },
            ]);
        }

        // Create the review
        const review = new Review({
            productId: product._id,
            authorId: body.authorId,
            rating: body.rating,
            title: body.title?.trim(),
            content: body.content.trim(),
            pros: body.pros?.trim(),
            cons: body.cons?.trim(),
            videoUrl: body.videoUrl,
            status: 'PENDING', // Reviews start as pending
            verified: false,
            helpfulCount: 0,
        });

        await review.save();

        return successResponse(
            {
                id: review._id.toString(),
                rating: review.rating,
                title: review.title,
                content: review.content,
                pros: review.pros,
                cons: review.cons,
                videoUrl: review.videoUrl,
                status: review.status,
                createdAt: review.createdAt,
            },
            undefined,
            201
        );
    } catch (error) {
        console.error('Error creating review:', error);
        return Errors.SERVER_ERROR('Failed to create review');
    }
}
