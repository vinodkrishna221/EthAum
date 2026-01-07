import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILaunch extends Document {
    productId: mongoose.Types.ObjectId;
    title: string;
    tagline: string;
    description?: string;
    media: {
        type: 'image' | 'video' | 'gif';
        url: string;
        caption?: string;
    }[];
    scheduledAt?: Date;
    launchedAt?: Date;
    status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
    featured: boolean;
    upvoteCount: number;
    commentCount: number;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const LaunchSchema = new Schema<ILaunch>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String },
    media: [{
        type: { type: String, enum: ['image', 'video', 'gif'] },
        url: String,
        caption: String
    }],
    scheduledAt: { type: Date },
    launchedAt: { type: Date },
    status: {
        type: String,
        enum: ['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'],
        default: 'DRAFT'
    },
    featured: { type: Boolean, default: false },
    upvoteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

LaunchSchema.index({ productId: 1 });
LaunchSchema.index({ launchedAt: -1 });
LaunchSchema.index({ status: 1 });
LaunchSchema.index({ featured: 1 });

const Launch: Model<ILaunch> = mongoose.models.Launch || mongoose.model<ILaunch>('Launch', LaunchSchema);
export default Launch;
