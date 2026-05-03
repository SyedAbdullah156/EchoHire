import { Schema } from "mongoose";
import { User } from "./user.model";
import { TCandidate } from "../types/candidate.types";

const candidateSchema = new Schema<TCandidate>(
    {
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
    },
    {
        _id: false, // Prevents creating a separate _id for the discriminator sub-schema
    }
);

export const Candidate = User.discriminator<TCandidate>("candidate", candidateSchema);
