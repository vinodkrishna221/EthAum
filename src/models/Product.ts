import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductMedia {
    type: 'image' | 'video' | 'gif';
    url: string;
    caption?: string;
}

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    pricingUrl?: string;
    media: IProductMedia[];
    features: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        tagline: { type: String },
        description: { type: String },
        logoUrl: { type: String },
        websiteUrl: { type: String },
        pricingUrl: { type: String },
        media: [
            {
                type: { type: String, enum: ['image', 'video', 'gif'] },
                url: String,
                caption: String,
            },
        ],
        features: [{ type: String }],
        tags: [{ type: String, lowercase: true }],
    },
    { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ companyId: 1 });
ProductSchema.index({ tags: 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
