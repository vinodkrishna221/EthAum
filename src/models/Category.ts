import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: mongoose.Types.ObjectId;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
