import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const profileFieldsSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(100).optional(),
    email: z.string().trim().email("Invalid email format").optional(),
    phone: z.string().trim().max(30).optional(),
    cityCountry: z.string().trim().max(100).optional(),
    linkedInUrl: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")),
    portfolioUrl: z.string().trim().url("Invalid portfolio URL").optional().or(z.literal("")),
    targetRole: z.string().trim().max(100).optional(),
    yearsExperience: z.string().trim().max(50).optional(),
    currentStatus: z.string().trim().max(100).optional(),
    degree: z.string().trim().max(100).optional(),
    university: z.string().trim().max(120).optional(),
    graduationYear: z.string().trim().max(10).optional(),
    cgpa: z.string().trim().max(20).optional(),
    coreSkills: z.string().trim().max(250).optional(),
    preferredIndustry: z.string().trim().max(120).optional(),
    interviewFocus: z.string().trim().max(120).optional(),
    careerGoal: z.string().trim().max(1000).optional(),
    avatarDataUrl: z
        .string()
        .trim()
        .regex(/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\r\n]+$/, "Avatar must be a base64 data URL")
        .refine((value) => value.length <= 2_000_000, "Avatar must be 2MB or smaller")
        .optional(),
}).strict();

export const updateProfileSchema = z.object({
    params: z.object({
        id: objectIdSchema.optional(),
    }).optional(),
    body: z.union([
        z.object({
            profile: profileFieldsSchema,
        }).strict(),
        profileFieldsSchema,
    ]),
});
