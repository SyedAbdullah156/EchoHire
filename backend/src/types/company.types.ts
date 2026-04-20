import mongoose from 'mongoose';

export interface ICompany {
    name: string;
    description?: string;
    owner_id: mongoose.Types.ObjectId; // Use the actual ID type here
}