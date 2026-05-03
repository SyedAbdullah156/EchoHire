import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";

export interface TJobRound {
    type: RoundType;
    max_questions: number;
}

export interface TJob {
    name: string;
    description: string;
    role: string;
    framework: string[];
    rounds: TJobRound[];
    deadline: Date;
    location?: string;
    salary_range?: string;
    requirements?: string[];
    type?: string;
    department?: string;
    difficulty?: number;
    soft_skills?: string[];
    custom_questions?: string[];
    company_id: mongoose.Types.ObjectId;
    is_active: boolean;
}
