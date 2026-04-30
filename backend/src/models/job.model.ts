import mongoose, { Schema } from "mongoose";
import { TJob } from "../types/job.types";
import { RoundType } from "../constants/roundtypes.constants";
import { JOB_LIMITS } from "../constants/job.constants";

const jobSchema = new Schema<TJob>(
    {
        name: {
            type: String,
            required: [true, "Job name is required"],
            trim: true,
            minlength: [
                JOB_LIMITS.NAME_MIN,
                `Name must be at least ${JOB_LIMITS.NAME_MIN} characters`,
            ],
            maxlength: [
                JOB_LIMITS.NAME_MAX,
                `Name cannot exceed ${JOB_LIMITS.NAME_MAX} characters`,
            ],
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
            minlength: [
                JOB_LIMITS.DESCRIPTION_MIN,
                `Description must be at least ${JOB_LIMITS.DESCRIPTION_MIN} characters`,
            ],
            maxlength: [
                JOB_LIMITS.DESCRIPTION_MAX,
                `Description cannot exceed ${JOB_LIMITS.DESCRIPTION_MAX} characters`,
            ],
        },
        role: {
            type: String,
            required: [true, "Target role is required"],
            trim: true,
            minlength: [
                JOB_LIMITS.ROLE_MIN,
                `Role must be at least ${JOB_LIMITS.ROLE_MIN} characters`,
            ],
            maxlength: [
                JOB_LIMITS.ROLE_MAX,
                `Role cannot exceed ${JOB_LIMITS.ROLE_MAX} characters`,
            ],
        },
        framework: {
            type: [{ type: String }],
            required: [true, "At least one framework must be specified"],
            default: [],
        },
        roundTypes: {
            type: [String],
            enum: {
                values: Object.values(RoundType),
                message: "{VALUE} is not a supported round type",
            },
            required: [true, "Assessment round types are required"],
            default: [],
        },
        deadline: {
            type: Date,
            required: [true, "An application deadline is required"],
        },
        company_id: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "The job must be linked to a Company ID"],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

export const Job = mongoose.model<TJob>("Job", jobSchema);
