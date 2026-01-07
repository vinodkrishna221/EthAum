import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    emailVerified?: Date;
    name?: string;
    image?: string;
    bio?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    role: 'USER' | 'STARTUP_ADMIN' | 'ENTERPRISE_BUYER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    emailVerified: { type: Date },
    name: { type: String, trim: true },
    image: { type: String },
    bio: { type: String },
    linkedinUrl: { type: String },
    twitterUrl: { type: String },
    role: {
        type: String,
        enum: ['USER', 'STARTUP_ADMIN', 'ENTERPRISE_BUYER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true });

UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
