import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
    launchId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    parentId?: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    launchId: {
        type: Schema.Types.ObjectId,
        ref: 'Launch',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    content: { type: String, required: true }
}, { timestamps: true });

CommentSchema.index({ launchId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentId: 1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
