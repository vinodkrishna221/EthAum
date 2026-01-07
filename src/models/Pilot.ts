import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPilot extends Document {
    productId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    pilotType: 'FREE_TRIAL' | 'DISCOUNTED' | 'POC' | 'ENTERPRISE_PILOT';
    originalPrice?: number;
    pilotPrice: number;
    durationDays: number;
    spotsTotal: number;
    spotsRemaining: number;
    requirements?: string;
    deliverables?: string;
    status: 'DRAFT' | 'ACTIVE' | 'FULL' | 'COMPLETED' | 'CANCELLED';
    startsAt?: Date;
    endsAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PilotSchema = new Schema<IPilot>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    pilotType: {
        type: String,
        enum: ['FREE_TRIAL', 'DISCOUNTED', 'POC', 'ENTERPRISE_PILOT'],
        required: true
    },
    originalPrice: { type: Number },
    pilotPrice: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    spotsTotal: { type: Number, required: true },
    spotsRemaining: { type: Number, required: true },
    requirements: { type: String },
    deliverables: { type: String },
    status: {
        type: String,
        enum: ['DRAFT', 'ACTIVE', 'FULL', 'COMPLETED', 'CANCELLED'],
        default: 'DRAFT'
    },
    startsAt: { type: Date },
    endsAt: { type: Date }
}, { timestamps: true });

PilotSchema.index({ productId: 1 });
PilotSchema.index({ status: 1 });

const Pilot: Model<IPilot> = mongoose.models.Pilot || mongoose.model<IPilot>('Pilot', PilotSchema);
export default Pilot;
