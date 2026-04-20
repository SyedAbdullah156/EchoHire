import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";

export type InterviewStatus = (typeof INTERVIEW_STATUS)[number];
export type RoundStatus = (typeof ROUND_STATUS)[number];

export interface Round {
    type: RoundType;
    status: RoundStatus;
    score?: number;
    remarks?: string;
}

export interface Violation {
    type: (typeof VIOLATION_TYPES)[number];
    timestamp: Date;
}

export interface IInterview {
    job_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rounds: Round[];
    status: InterviewStatus;
    cv_url?: string;
    parsed_cv?: string;
    score?: number;
    remarks?: string;
    violations?: Violation[];
}
