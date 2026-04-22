import mongoose, { Schema } from 'mongoose';
import { TCompany } from '../types/company.types';

const companySchema = new Schema<TCompany>({
    name: { 
        type: String, 
        required: [true, 'Company name is required'],
        trim: true,
        unique: true,
        minlength: [2, 'Company name must be at least 2 characters long'],
        maxlength: [50, 'Company name must be at most 50 characters long']
    },
    description: { 
        type: String,
        required: [true, 'Please provide a brief description of the company'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    website: { 
        type: String,
        match: [
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 
            'Please provide a valid website URL'
        ]
    },
    logo: { 
        type: String, 
        default: 'https://placehold.co/400x400?text=Company+Logo'
    },
    owner_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'A company must have an owner (User ID)'] 
    }
}, { 
    timestamps: true 
});

export const Company = mongoose.model<TCompany>('Company', companySchema);