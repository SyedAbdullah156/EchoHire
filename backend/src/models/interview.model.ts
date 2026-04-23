import mongoose, { Schema } from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { TRound, TViolation, TInterview } from "../types/interview.types";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import { INTERVIEW_LIMITS } from "../constants/interview.constants";

const roundSchema = new Schema<TRound>(
  {
    type: {
        type: String,
        enum: {
            values: Object.values(RoundType),
            message: '{VALUE} is not a valid round type'
        },
        required: [true, "Interview round type is required"],
    },
    score: { 
        type: Number, 
        required: false,
        min: [INTERVIEW_LIMITS.SCORE_MIN, `Score cannot be less than ${INTERVIEW_LIMITS.SCORE_MIN}`],
        max: [INTERVIEW_LIMITS.SCORE_MAX, `Score cannot exceed ${INTERVIEW_LIMITS.SCORE_MAX}`]
    },
    remarks: { 
        type: String, 
        required: false,
        trim: true,
        minlength: [INTERVIEW_LIMITS.REMARKS_MIN, `Remarks must be at least ${INTERVIEW_LIMITS.REMARKS_MIN} characters`],
        maxlength: [INTERVIEW_LIMITS.REMARKS_MAX, `Remarks cannot exceed ${INTERVIEW_LIMITS.REMARKS_MAX} characters`]
    },
    status: { 
        type: String, 
        enum: {
            values: ROUND_STATUS,
            message: '{VALUE} is not a valid round status'
        },
        default: "pending" 
    },
  },
  { _id: false },
);

const violationSchema = new Schema<TViolation>(
  {
    type: {
        type: String,
        enum: {
            values: VIOLATION_TYPES,
            message: '{VALUE} is not a recognized violation type'
        },
        required: [true, "Violation type must be specified"],
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

export const interviewSchema = new Schema<TInterview>(
  {
    job_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Job", 
        required: [true, "An interview must be linked to a specific job"] 
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "An interview must be linked to a candidate (user)"] 
    },
    rounds: {
        type: [roundSchema],
        required: [true, "At least one interview round must be defined"],
        default: [],
    },
    cv_url: { type: String, required: false },
    score: { 
        type: Number, 
        required: false,
        min: [INTERVIEW_LIMITS.SCORE_MIN, `Score cannot be less than ${INTERVIEW_LIMITS.SCORE_MIN}`],
        max: [INTERVIEW_LIMITS.SCORE_MAX, `Score cannot exceed ${INTERVIEW_LIMITS.SCORE_MAX}`]
    },
    remarks: { 
        type: String, 
        required: false,
        trim: true,
        minlength: [INTERVIEW_LIMITS.REMARKS_MIN, `Remarks must be at least ${INTERVIEW_LIMITS.REMARKS_MIN} characters`],
        maxlength: [INTERVIEW_LIMITS.REMARKS_MAX, `Remarks cannot exceed ${INTERVIEW_LIMITS.REMARKS_MAX} characters`]
    },
    status: {
        type: String,
        enum: {
            values: INTERVIEW_STATUS,
            message: '{VALUE} is not a valid interview status'
        },
        default: "applied",
    },
    violations: {
        type: [violationSchema],
        default: []
    },
  },
  { timestamps: true },
);

export const Interview = mongoose.model<TInterview>("Interview", interviewSchema);