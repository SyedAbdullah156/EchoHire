import { z } from "zod";

export const candidateProfileSchema = z.object({
    phone: z.string().trim().max(30, "Phone must be at most 30 characters").optional(),
    cityCountry: z.string().trim().max(100, "City/Country must be at most 100 characters").optional(),
    linkedInUrl: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")),
    portfolioUrl: z.string().trim().url("Invalid portfolio URL").optional().or(z.literal("")),
    targetRole: z.string().trim().max(100, "Target role must be at most 100 characters").optional(),
    yearsExperience: z.string().trim().max(50, "Years of experience must be at most 50 characters").optional(),
    currentStatus: z.string().trim().max(100, "Current status must be at most 100 characters").optional(),
    degree: z.string().trim().max(100, "Degree must be at most 100 characters").optional(),
    university: z.string().trim().max(120, "University must be at most 120 characters").optional(),
    graduationYear: z.string().trim().max(10, "Graduation year must be at most 10 characters").optional(),
    cgpa: z.string().trim().max(20, "CGPA must be at most 20 characters").optional(),
    coreSkills: z.string().trim().max(250, "Core skills must be at most 250 characters").optional(),
    preferredIndustry: z.string().trim().max(120, "Preferred industry must be at most 120 characters").optional(),
    interviewFocus: z.string().trim().max(120, "Interview focus must be at most 120 characters").optional(),
    careerGoal: z.string().trim().max(1000, "Career goal must be at most 1000 characters").optional(),
    avatarDataUrl: z.string().trim().optional().or(z.literal("")),
});

export const updateCandidateProfileSchema = z.object({
    body: z.object({
        profile: candidateProfileSchema.optional(),
    }),
});
