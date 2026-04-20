import mongoose from 'mongoose';

export interface IEmployee {
    company_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    role: string;
}