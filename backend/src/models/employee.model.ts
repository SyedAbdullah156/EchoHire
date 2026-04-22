import mongoose, { Schema } from 'mongoose';
import { TEmployee } from '../types/employee.types';

const employeeSchema = new Schema<TEmployee>({
    company_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company', 
        required: [true, "Employee must be linked to a company"] 
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, "Employee must be associated with a user account"] 
    },
    role: { 
        type: String, 
        required: [true, "Employee role (e.g., HR, Admin, Interviewer) is required"],
        trim: true
    }
}, { 
    timestamps: true 
});

/**
 * Using Compound Index
 * This ensures that a User cannot be added to the same Company as an employee more than once.
 * It prevents duplicate data and ensures data integrity.
 */
employeeSchema.index({ company_id: 1, user_id: 1 }, { unique: true });

export const Employee = mongoose.model<TEmployee>('Employee', employeeSchema);