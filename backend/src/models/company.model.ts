import mongoose, { Schema } from 'mongoose';
import { TCompany } from '../types/company.types';

const companySchema = new Schema<TCompany>({
    name: { 
        type: String, 
        required: [true, 'Company name is required'],
        trim: true,
        unique: true
    },
    description: { 
        type: String,
        required: false
    },
    website: { type: String },
    logo: { 
        type: String, 
        default: 'default-logo.png' 
    },
    owner_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

export const Company = mongoose.model<TCompany>('Company', companySchema);
  