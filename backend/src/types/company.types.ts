import mongoose from 'mongoose';

export interface TCompany {
    name: string;
    description?: string;
    website?: string,
    logo?: string,
    owner_id: mongoose.Types.ObjectId; // Use the actual ID type here
}