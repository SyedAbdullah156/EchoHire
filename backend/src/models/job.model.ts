import mongoose, { Schema } from "mongoose";
import { TJob, TJobRound } from "../types/job.types";
import { RoundType } from "../constants/roundtypes.constants";

const jobRoundSchema = new Schema<TJobRound>(
    {
        type: { type: String, enum: Object.values(RoundType), required: true },
        max_questions: {
            type: Number,
            required: true,
            min: 1,
            max: 15,
            default: 5,
        },
    },
    { _id: false },
);

const jobSchema = new Schema<TJob>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        role: { type: String, required: true },
        framework: [{ type: String }],
        rounds: { type: [jobRoundSchema], required: true },
        deadline: { type: Date, required: true },
        company_id: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export const Job = mongoose.model<TJob>("Job", jobSchema);
