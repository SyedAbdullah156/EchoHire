import { z } from "zod";
import { RoundType } from "../constants/roundtypes.constants";
import { JOB_LIMITS } from "../constants/job.constants";

// ObjectId validation
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// Job Body validation
const jobBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .min(JOB_LIMITS.NAME_MIN, `Min ${JOB_LIMITS.NAME_MIN} chars`)
        .max(JOB_LIMITS.NAME_MAX, `Max ${JOB_LIMITS.NAME_MAX} chars`),

    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(
            JOB_LIMITS.DESCRIPTION_MIN,
            `Min ${JOB_LIMITS.DESCRIPTION_MIN} chars`,
        )
        .max(
            JOB_LIMITS.DESCRIPTION_MAX,
            `Max ${JOB_LIMITS.DESCRIPTION_MAX} chars`,
        ),

    role: z
        .string()
        .trim()
        .min(1, "Role is required")
        .min(JOB_LIMITS.ROLE_MIN, `Min ${JOB_LIMITS.ROLE_MIN} chars`)
        .max(JOB_LIMITS.ROLE_MAX, `Max ${JOB_LIMITS.ROLE_MAX} chars`),

    framework: z
        .array(z.string().min(1, "Framework cannot be empty"))
        .min(JOB_LIMITS.FRAMEWORK_MIN, "At least one framework required"),

    roundTypes: z
        .array(z.nativeEnum(RoundType))
        .min(JOB_LIMITS.ROUNDS_MIN, "Select at least one round type"),

    deadline: z
        .string()
        .min(1, "Deadline is required")
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .transform((val) => new Date(val)),

    company_id: objectIdSchema, 

    is_active: z.boolean().optional().default(true),
});

// Create Job
export const createJobSchema = z.object({
    body: jobBodySchema,
});

// Update Job (partial body only)
export const updateJobSchema = z.object({
    body: jobBodySchema.partial(),
});

// Params validation
export const jobParamsSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});
