import { z } from "zod";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const emailSchema = z.string().trim().email("Invalid email format");

const signupPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
        /[^A-Za-z0-9]/,
        "Password must include at least one special character",
    );

const loginPasswordSchema = z.string().min(1, "Password is required");

const profileFieldsSchema = z
    .object({
        phone: z
            .string()
            .trim()
            .max(30, "Phone must be at most 30 characters")
            .optional(),
        cityCountry: z
            .string()
            .trim()
            .max(100, "City/Country must be at most 100 characters")
            .optional(),
        linkedInUrl: z
            .string()
            .trim()
            .url("Invalid LinkedIn URL")
            .optional()
            .or(z.literal("")),
        githubUrl: z
            .string()
            .trim()
            .url("Invalid GitHub URL")
            .optional()
            .or(z.literal("")),
        portfolioUrl: z
            .string()
            .trim()
            .url("Invalid portfolio URL")
            .optional()
            .or(z.literal("")),
        targetRole: z
            .string()
            .trim()
            .max(100, "Target role must be at most 100 characters")
            .optional(),
        yearsExperience: z
            .string()
            .trim()
            .max(50, "Years of experience must be at most 50 characters")
            .optional(),
        currentStatus: z
            .string()
            .trim()
            .max(100, "Current status must be at most 100 characters")
            .optional(),
        degree: z
            .string()
            .trim()
            .max(100, "Degree must be at most 100 characters")
            .optional(),
        university: z
            .string()
            .trim()
            .max(120, "University must be at most 120 characters")
            .optional(),
        graduationYear: z
            .string()
            .trim()
            .max(10, "Graduation year must be at most 10 characters")
            .optional(),
        cgpa: z
            .string()
            .trim()
            .max(20, "CGPA must be at most 20 characters")
            .optional(),
        coreSkills: z
            .string()
            .trim()
            .max(250, "Core skills must be at most 250 characters")
            .optional(),
        preferredIndustry: z
            .string()
            .trim()
            .max(120, "Preferred industry must be at most 120 characters")
            .optional(),
        interviewFocus: z
            .string()
            .trim()
            .max(120, "Interview focus must be at most 120 characters")
            .optional(),
        careerGoal: z
            .string()
            .trim()
            .max(1000, "Career goal must be at most 1000 characters")
            .optional(),
        avatarDataUrl: z
            .string()
            .trim()
            .regex(
                /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\r\n]+$/,
                "Avatar must be a valid base64 image data URL",
            )
            .refine(
                (value) => value.length <= 2_000_000,
                "Avatar must be 2MB or smaller",
            )
            .optional(),
    })
    .strict();

const userBodySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        email: emailSchema,
        password: signupPasswordSchema,
        role: z.enum(["candidate", "recruiter", "admin"]).optional(),
        profile: profileFieldsSchema.optional(),
    })
    .strict();

export const registerSchema = z.object({
    body: userBodySchema,
});

export const loginSchema = z.object({
    body: z
        .object({
            email: emailSchema,
            password: loginPasswordSchema,
        })
        .strict(),
});

export const updateProfileSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(2, "Name must be at least 2 characters")
                .max(100, "Name must be at most 100 characters")
                .optional(),
            email: emailSchema.optional(),
            profile: profileFieldsSchema.optional(),
        })
        .strict(),
});
