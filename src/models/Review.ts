import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    rating: number;
    title?: string;
    content: string;
    pros?: string;
    cons?: string;
    videoUrl?: string;
    verified: boolean;
    verifiedAt?: Date;
    status: ReviewStatus;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: { type: String },
        content: { type: String, required: true },
        pros: { type: String },
        cons: { type: String },
        videoUrl: { type: String },
        verified: { type: Boolean, default: false },
        verifiedAt: { type: Date },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
        helpfulCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Indexes for efficient queries
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ authorId: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ verified: 1 });
ReviewSchema.index({ productId: 1, status: 1 }); // Compound for filtered listing
ReviewSchema.index({ productId: 1, createdAt: -1 }); // For recent reviews

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
