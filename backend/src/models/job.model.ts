import mongoose, { Schema } from "mongoose";
import { TJob } from "../types/job.types";
import { RoundType } from "../constants/roundtypes.constants";

const jobSchema = new Schema<TJob>({
    name: { 
        type: String, 
        required: [true, "Job name is required"] 
    },
    description: { 
        type: String, 
        required: [true, "Job description is required"] 
    },
    role: { 
        type: String, 
        required: [true, "Target role (e.g. Backend Developer) is required"] 
    },
    framework: { 
        type: [{ type: String }], 
        required: [true, "At least one framework or technology must be specified"], 
        default: [] 
    },
    roundTypes: {
        type: [String],
        enum: {
            values: Object.values(RoundType),
            message: '{VALUE} is not a supported round type'
        },
        required: [true, "Assessment round types are required"],
        default: [],
    },
    deadline: { 
        type: Date, 
        required: [true, "An application deadline is required"] 
    },
    company_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Company", 
        required: [true, "The job must be linked to a Company ID"] 
    },
    is_active: { 
        type: Boolean, 
        default: true
    },
}, { timestamps: true });

export const Job = mongoose.model<TJob>("Job", jobSchema);
