import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";

export interface TQAPair {
    question: string;
    candidate_answer?: string;
    ai_evaluation?: string;
    timestamp: Date;
}

export interface TInterviewRound {
    type: RoundType;
    status: (typeof ROUND_STATUS)[number];
    qa_pairs: TQAPair[];
    max_questions: number;
    score?: number;
    remarks?: string;
}

export interface TInterview {
    job_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    status: (typeof INTERVIEW_STATUS)[number];
    rounds: TInterviewRound[];
    cv_url?: string;
    score?: number;
    remarks?: string;
    violations?: { type: (typeof VIOLATION_TYPES)[number]; timestamp: Date }[];
}
