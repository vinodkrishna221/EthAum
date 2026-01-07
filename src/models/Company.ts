import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    revenueStage?: 'PRE_REVENUE' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | 'SERIES_D';
    arrRange?: string;
    teamSize?: 'SIZE_1_10' | 'SIZE_11_50' | 'SIZE_51_200' | 'SIZE_201_500' | 'SIZE_500_PLUS';
    foundedAt?: Date;
    headquarters?: string;
    verified: boolean;
    featured: boolean;
    categoryId?: mongoose.Types.ObjectId;
    members: {
        userId: mongoose.Types.ObjectId;
        role: 'OWNER' | 'ADMIN' | 'MEMBER';
        joinedAt: Date;
    }[];
    credibilityScore?: {
        overall: number;
        review: number;
        launch: number;
        engagement: number;
        verification: number;
        calculatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String },
    description: { type: String },
    logoUrl: { type: String },
    website: { type: String },
    linkedinUrl: { type: String },
    twitterUrl: { type: String },
    revenueStage: {
        type: String,
        enum: ['PRE_REVENUE', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D']
    },
    arrRange: { type: String },
    teamSize: {
        type: String,
        enum: ['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS']
    },
    foundedAt: { type: Date },
    headquarters: { type: String },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
            type: String,
            enum: ['OWNER', 'ADMIN', 'MEMBER'],
            default: 'MEMBER'
        },
        joinedAt: { type: Date, default: Date.now }
    }],
    credibilityScore: {
        overall: { type: Number, default: 0 },
        review: { type: Number, default: 0 },
        launch: { type: Number, default: 0 },
        engagement: { type: Number, default: 0 },
        verification: { type: Number, default: 0 },
        calculatedAt: { type: Date }
    }
}, { timestamps: true });

CompanySchema.index({ slug: 1 });
CompanySchema.index({ categoryId: 1 });
CompanySchema.index({ revenueStage: 1 });
CompanySchema.index({ 'members.userId': 1 });

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
export default Company;
