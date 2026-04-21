import mongoose, { Schema } from "mongoose";
import { TJob } from "../types/job.types";
import { RoundType } from "../constants/roundtypes.constants";

const jobSchema = new Schema<TJob>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String, required: true },
    framework: { 
        type: [{ type: String }], 
        required: true, 
        default: [] 
    },
    roundTypes: {
        type: [String],
        enum: Object.values(RoundType),
        required: true,
        default: [],
    },
    deadline: { type: Date, required: true },
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    is_active: { 
        type: Boolean, 
        default: true
    },
}, { timestamps: true });

export const Job = mongoose.model<TJob>("Job", jobSchema);
