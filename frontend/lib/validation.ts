import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email (e.g., name@example.com)");
export const signupPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");

const loginPasswordSchema = z.string().min(1, "Password is required");

export const authSchema = z
    .discriminatedUnion("mode", [
        z.object({
            mode: z.literal("signin"),
            email: emailSchema,
            password: loginPasswordSchema,
        }),
        z.object({
            mode: z.literal("signup"),
            name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or less"),
            email: emailSchema,
            password: signupPasswordSchema,
            confirmPassword: z.string().min(1, "Confirm your password"),
            role: z.enum(["candidate", "recruiter"]),
        }).refine((value) => value.password === value.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }),
    ]);

export const profileSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(100, "Full name is too long"),
    email: emailSchema,
    phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
    cityCountry: z.string().trim().max(100, "Location is too long").optional().or(z.literal("")),
    linkedInUrl: z.string().trim().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().trim().url("Enter a valid GitHub URL").optional().or(z.literal("")),
    portfolioUrl: z.string().trim().url("Enter a valid portfolio URL").optional().or(z.literal("")),
    targetRole: z.string().trim().max(100, "Target role is too long").optional().or(z.literal("")),
    yearsExperience: z.string().trim().max(50, "Years of experience is too long").optional().or(z.literal("")),
    currentStatus: z.string().trim().max(100, "Current status is too long").optional().or(z.literal("")),
    degree: z.string().trim().max(100, "Degree is too long").optional().or(z.literal("")),
    university: z.string().trim().max(120, "University is too long").optional().or(z.literal("")),
    graduationYear: z.string().trim().max(10, "Graduation year is too long").optional().or(z.literal("")),
    cgpa: z.string().trim().max(20, "CGPA is too long").optional().or(z.literal("")),
    coreSkills: z.string().trim().max(250, "Core skills are too long").optional().or(z.literal("")),
    preferredIndustry: z.string().trim().max(120, "Preferred industry is too long").optional().or(z.literal("")),
    interviewFocus: z.string().trim().max(120, "Interview focus is too long").optional().or(z.literal("")),
    careerGoal: z.string().trim().max(1000, "Career goal is too long").optional().or(z.literal("")),
    avatarDataUrl: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),
});

export const parseZodMessage = (error: z.ZodError) =>
    error.issues
        .map((issue) => issue.message)
        .filter(Boolean)
        .join(" ");

export const getZodFieldMessage = (error: z.ZodError, field: string) =>
    error.issues.find((issue) => issue.path.join(".") === field)?.message ?? "";

export const getZodFieldMessages = (error: z.ZodError) => {
    return error.issues.reduce<Record<string, string>>((accumulator, issue) => {
        const key = issue.path.join(".");
        if (!key || accumulator[key]) {
            return accumulator;
        }

        accumulator[key] = issue.message;
        return accumulator;
    }, {});
};
