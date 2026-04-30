import mongoose from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";

export interface TQAPair {
    question: string;
    candidate_answer?: string;
    ai_evaluation?: string;
    timestamp: Date;
    metadata?: {
        problem_statement?: string;
        test_cases?: Array<{ input: string; expected: string }>;
        initial_code?: string;
        constraints?: string[];
        examples?: string[];
    };
}

export interface TInterviewRound {
    type: RoundType;
    status: (typeof ROUND_STATUS)[number];
    qa_pairs: TQAPair[];
    max_questions: number;
    score?: number;
    remarks?: string;
    phase_data?: {
        quiz_score?: number;
        coding_complexity?: { time: string; space: string };
        test_cases_passed?: number;
        test_cases_total?: number;
    };
}

export interface TInterview {
    job_id?: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    is_practice?: boolean;
    status: (typeof INTERVIEW_STATUS)[number];
    rounds: TInterviewRound[];
    tech_stack?: string;
    cv_url?: string;
    score?: number;
    remarks?: string;
    violations?: { type: (typeof VIOLATION_TYPES)[number]; timestamp: Date }[];
    assessment_token?: string;
    join_code?: string;
    access_code?: string;
    access_code_expires?: Date;
}
