"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const emailSchema = zod_1.z.string().trim().email("Invalid email format");
const signupPasswordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");
const loginPasswordSchema = zod_1.z.string().min(1, "Password is required");
const profileFieldsSchema = zod_1.z
    .object({
    phone: zod_1.z
        .string()
        .trim()
        .max(30, "Phone must be at most 30 characters")
        .optional(),
    cityCountry: zod_1.z
        .string()
        .trim()
        .max(100, "City/Country must be at most 100 characters")
        .optional(),
    linkedInUrl: zod_1.z
        .string()
        .trim()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(zod_1.z.literal("")),
    githubUrl: zod_1.z
        .string()
        .trim()
        .url("Invalid GitHub URL")
        .optional()
        .or(zod_1.z.literal("")),
    portfolioUrl: zod_1.z
        .string()
        .trim()
        .url("Invalid portfolio URL")
        .optional()
        .or(zod_1.z.literal("")),
    targetRole: zod_1.z
        .string()
        .trim()
        .max(100, "Target role must be at most 100 characters")
        .optional(),
    yearsExperience: zod_1.z
        .string()
        .trim()
        .max(50, "Years of experience must be at most 50 characters")
        .optional(),
    currentStatus: zod_1.z
        .string()
        .trim()
        .max(100, "Current status must be at most 100 characters")
        .optional(),
    degree: zod_1.z
        .string()
        .trim()
        .max(100, "Degree must be at most 100 characters")
        .optional(),
    university: zod_1.z
        .string()
        .trim()
        .max(120, "University must be at most 120 characters")
        .optional(),
    graduationYear: zod_1.z
        .string()
        .trim()
        .max(10, "Graduation year must be at most 10 characters")
        .optional(),
    cgpa: zod_1.z
        .string()
        .trim()
        .max(20, "CGPA must be at most 20 characters")
        .optional(),
    coreSkills: zod_1.z
        .string()
        .trim()
        .max(250, "Core skills must be at most 250 characters")
        .optional(),
    preferredIndustry: zod_1.z
        .string()
        .trim()
        .max(120, "Preferred industry must be at most 120 characters")
        .optional(),
    interviewFocus: zod_1.z
        .string()
        .trim()
        .max(120, "Interview focus must be at most 120 characters")
        .optional(),
    careerGoal: zod_1.z
        .string()
        .trim()
        .max(1000, "Career goal must be at most 1000 characters")
        .optional(),
    avatarDataUrl: zod_1.z
        .string()
        .trim()
        .optional()
        .or(zod_1.z.literal("")),
})
    .strict();
const userBodySchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    email: emailSchema,
    password: signupPasswordSchema,
    role: zod_1.z.enum(["candidate", "recruiter", "admin"]).optional(),
    profile: profileFieldsSchema.optional(),
})
    .strict();
exports.registerSchema = zod_1.z.object({
    body: userBodySchema,
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: emailSchema,
        password: loginPasswordSchema,
    })
        .strict(),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters")
            .optional(),
        email: emailSchema.optional(),
        profile: profileFieldsSchema.optional(),
    })
});
