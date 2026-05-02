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
        googleId: {
            type: String,
            required: false,
        },
        resetPasswordToken: {
            type: String,
            required: false,
        },
        resetPasswordExpires: {
            type: Date,
            required: false,
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
            // Recruiter Specific
            jobTitle: { type: String },
            companyId: { type: Schema.Types.ObjectId, ref: "Company" },
            companyName: { type: String },
            companyWebsite: { type: String },
            companySize: { type: String },
            industry: { type: String },
            recruitingFocus: { type: String },
            bio: { type: String },
            notifications: {
                email: { type: Boolean, default: true },
                desktop: { type: Boolean, default: true },
                marketing: { type: Boolean, default: false },
            },
        },
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model<TUser>("User", userSchema);