import mongoose, { Schema } from 'mongoose';
import { TUser } from '../types/user.types';

const userSchema = new Schema<TUser>({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        trim: true
    },
    password: { 
        type: String, 
        required: false,
        select: false
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter', 'admin'],
        default: 'candidate'
    },
}, { 
    timestamps: true
});

export const User = mongoose.model<TUser>('User', userSchema);