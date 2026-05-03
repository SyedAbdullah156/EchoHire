import { Schema } from "mongoose";
import { User } from "./user.model";
import { TEmployee } from "../types/employee.types";

const employeeSchema = new Schema<TEmployee>(
    {
        company_id: {
            type: Schema.Types.ObjectId,
            ref: "Company",
        },
        jobTitle: {
            type: String,
            trim: true,
            maxlength: [100, "Job title cannot exceed 100 characters"],
        },
        recruitingFocus: {
            type: String,
            trim: true,
            maxlength: [250, "Recruiting focus cannot exceed 250 characters"],
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [1000, "Bio cannot exceed 1000 characters"],
        },
        notifications: {
            email: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            marketing: { type: Boolean, default: false },
        },
    },
    {
        _id: false,
    }
);

export const Employee = User.discriminator<TEmployee>("recruiter", employeeSchema);
