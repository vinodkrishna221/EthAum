import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPilotInquiry extends Document {
    pilotId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    companyName?: string;
    message?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PilotInquirySchema = new Schema<IPilotInquiry>({
    pilotId: {
        type: Schema.Types.ObjectId,
        ref: 'Pilot',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: { type: String },
    message: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
        default: 'PENDING'
    },
    respondedAt: { type: Date }
}, { timestamps: true });

PilotInquirySchema.index({ pilotId: 1 });
PilotInquirySchema.index({ userId: 1 });
PilotInquirySchema.index({ status: 1 });

const PilotInquiry: Model<IPilotInquiry> = mongoose.models.PilotInquiry || mongoose.model<IPilotInquiry>('PilotInquiry', PilotInquirySchema);
export default PilotInquiry;
