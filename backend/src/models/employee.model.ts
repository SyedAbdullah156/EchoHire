import mongoose, { Schema } from 'mongoose';
import { TEmployee } from '../types/employee.types';

const employeeSchema = new Schema<TEmployee>({
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true }
});

export const Employee = mongoose.model<TEmployee>('Employee', employeeSchema); 