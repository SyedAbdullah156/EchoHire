import { z } from "zod";
import { mongoIdString } from "./common.validation";

const employeeBodySchema = z.object({
    company_id: mongoIdString.optional(),
    jobTitle: z
        .string()
        .trim()
        .max(100, "Job title must be at most 100 characters")
        .optional(),
    recruitingFocus: z
        .string()
        .trim()
        .max(250, "Recruiting focus must be at most 250 characters")
        .optional(),
    bio: z
        .string()
        .trim()
        .max(1000, "Bio must be at most 1000 characters")
        .optional(),
    notifications: z
        .object({
            email: z.boolean().optional(),
            desktop: z.boolean().optional(),
            marketing: z.boolean().optional(),
        })
        .optional(),
});

export const createEmployeeSchema = z.object({
    body: employeeBodySchema,
});

export const updateEmployeeSchema = z.object({
    body: employeeBodySchema.partial(),
});
