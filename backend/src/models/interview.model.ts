import mongoose, { Schema } from "mongoose";
import { RoundType } from "../constants/roundtypes.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import {
    TInterview,
    TInterviewRound,
    TMessage,
} from "../types/interview.types";

const messageSchema = new Schema<TMessage>(
    {
        role: {
            type: String,
            enum: ["ai", "candidate"],
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false },
);

const violationSchema = new Schema<any>(
    {
        type: {
            type: String,
            enum: {
                values: VIOLATION_TYPES,
                message: "{VALUE} is not a recognized violation type",
            },
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false },
);

const roundSchema = new Schema<TInterviewRound>(
    {
        type: {
            type: String,
            enum: {
                values: Object.values(RoundType),
                message: "{VALUE} is not a valid round type",
            },
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ROUND_STATUS,
                message: "{VALUE} is not a valid round status",
            },
            default: "pending",
        },
        messages: {
            type: [messageSchema],
            default: [],
        },
        max_questions: {
            type: Number,
            required: true,
            default: 5,
            min: 1,
            max: 15,
        },
        score: {
            type: Number,
            min: [0, "Score cannot be less than 0"],
            max: [10, "Score cannot exceed 10"],
        },
        remarks: {
            type: String,
            trim: true,
        },
    },
    { _id: false },
);

const interviewSchema = new Schema<TInterview>(
    {
        job_id: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "An interview must be linked to a specific job"],
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "An interview must be linked to a candidate"],
        },
        status: {
            type: String,
            enum: {
                values: INTERVIEW_STATUS,
                message: "{VALUE} is not a valid interview status",
            },
            default: "applied",
        },
        rounds: {
            type: [roundSchema],
            default: [],
        },
        cv_url: {
            type: String,
        },
        score: {
            type: Number,
            min: [0, "Score cannot be less than 0"],
            max: [10, "Score cannot exceed 10"],
        },
        remarks: {
            type: String,
            trim: true,
        },
        violations: {
            type: [violationSchema],
            default: [],
        },
    },
    { timestamps: true },
);

export const Interview = mongoose.model<TInterview>(
    "Interview",
    interviewSchema,
);
