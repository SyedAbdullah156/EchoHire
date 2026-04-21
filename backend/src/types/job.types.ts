import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";

export interface TJob {
    name: string;
    description: string;
    role: string;
    framework: string[];
    roundTypes: RoundType[];
    deadline: Date;
    company_id: mongoose.Types.ObjectId;
    is_active: boolean;
}
