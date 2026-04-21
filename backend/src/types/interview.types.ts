import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";

export type TInterviewStatus = (typeof INTERVIEW_STATUS)[number];
export type TRoundStatus = (typeof ROUND_STATUS)[number];

export interface TRound {
    type: RoundType;
    status: TRoundStatus;
    score?: number;
    remarks?: string;
}

export interface TViolation {
    type: (typeof VIOLATION_TYPES)[number];
    timestamp: Date;
}

export interface TInterview {
    job_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rounds: TRound[];
    status: TInterviewStatus;
    cv_url?: string;
    score?: number;
    remarks?: string;
    violations?: TViolation[];
}
