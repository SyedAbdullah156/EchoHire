import mongoose, { Schema } from "mongoose";
import { TUser } from "../types/user.types";

const userSchema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            select: false,
        },
        role: {
            type: String,
            enum: ["candidate", "recruiter", "admin"],
            default: "candidate",
        },
    },
    {
        timestamps: true,
    },
    password: { 
        type: String, 
        required: false,
        select: false
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter', 'admin'],
        default: 'candidate'
    },
    profile: {
        phone: { type: String },
        cityCountry: { type: String },
        linkedInUrl: { type: String },
        githubUrl: { type: String },
        portfolioUrl: { type: String },
        targetRole: { type: String },
        yearsExperience: { type: String },
        currentStatus: { type: String },
        degree: { type: String },
        university: { type: String },
        graduationYear: { type: String },
        cgpa: { type: String },
        coreSkills: { type: String },
        preferredIndustry: { type: String },
        interviewFocus: { type: String },
        careerGoal: { type: String },
        avatarDataUrl: { type: String },
    },
}, { 
    timestamps: true
});

export const User = mongoose.model<TUser>("User", userSchema);
