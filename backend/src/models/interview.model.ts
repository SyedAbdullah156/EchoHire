import mongoose, { Schema } from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { Round, Violation, IInterview } from "../types/interview.types";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";

const roundSchema = new Schema<Round>(
  {
    type: {
        type: String,
        enum: Object.values(RoundType),
        required: true,
    },
    score: { type: Number, required: false },
    remarks: { type: String, required: false },
    status: { 
        type: String, 
        enum: ROUND_STATUS,
        default: "pending" 
    },
  },
  { _id: false },
);

const violationSchema = new Schema<Violation>(
  {
    type: {
        type: String,
        enum: VIOLATION_TYPES,
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

export const interviewSchema = new Schema<IInterview>(
  {
    job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rounds: {
        type: [roundSchema],
        required: true,
        default: [],
    },
    cv_url: { type: String, required: false },
    parsed_cv: { type: String, required: false },
    score: { type: Number, required: false },
    remarks: { type: String, required: false },
    status: {
        type: String,
        enum: INTERVIEW_STATUS,
        default: "applied",
    },
    violations: {
        type: [violationSchema],
        default: []
    },
  },
  { timestamps: true },
);

export const Interview = mongoose.model<IInterview>("Interview", interviewSchema)