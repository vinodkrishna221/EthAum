import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUpvote extends Document {
    launchId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UpvoteSchema = new Schema<IUpvote>({
    launchId: {
        type: Schema.Types.ObjectId,
        ref: 'Launch',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

UpvoteSchema.index({ launchId: 1, userId: 1 }, { unique: true });
UpvoteSchema.index({ launchId: 1 });
UpvoteSchema.index({ userId: 1 });

const Upvote: Model<IUpvote> = mongoose.models.Upvote || mongoose.model<IUpvote>('Upvote', UpvoteSchema);
export default Upvote;
