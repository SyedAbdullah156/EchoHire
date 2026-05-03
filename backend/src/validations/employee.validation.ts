import { z } from "zod";
import { mongoIdString } from "./common.validation";

const employeeBodySchema = z.object({
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

export const updateEmployeeSchema = z.object({
    body: employeeBodySchema.partial().extend({
        name: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
        email: z.string().trim().email("Invalid email").optional(),
    }).strict(),
});
