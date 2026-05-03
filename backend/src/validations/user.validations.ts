import { z } from "zod";

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

const userBodySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        email: emailSchema,
        password: signupPasswordSchema,
        role: z.enum(["candidate", "recruiter", "admin"]),
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

export const googleAuthSchema = z.object({
    body: z.object({
        credential: z.string().min(1, "Credential is required"),
        role: z.enum(["candidate", "recruiter", "admin"]).optional(),
    }).strict(),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: emailSchema,
    }).strict(),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
        password: signupPasswordSchema,
    }).strict(),
});

export const updateProfileSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(2, "Name must be at least 2 characters")
                .max(100, "Name must be at most 100 characters")
                .optional(),
            email: emailSchema.optional(),
        })
});
