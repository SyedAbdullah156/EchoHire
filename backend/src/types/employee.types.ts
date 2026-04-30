import mongoose from "mongoose";

export interface TEmployee {
    company_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    role: string;
}
