import { z } from "zod";
import { RoundType } from "../constants/roundtypes.constants";
import { JOB_LIMITS } from "../constants/job.constants";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const jobRoundSchema = z.object({
    type: z.nativeEnum(RoundType, {
        message: "Invalid round type selected",
    }),
    max_questions: z
        .number()
        .min(1, "Must ask at least 1 question")
        .max(15, "Cannot exceed 15 questions per round")
        .default(5),
});

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
        .array(z.string().min(1, "Framework name cannot be empty"))
        .min(JOB_LIMITS.FRAMEWORK_MIN, "At least one framework is required"),

    rounds: z
        .array(jobRoundSchema)
        .min(JOB_LIMITS.ROUNDS_MIN, "Define at least one interview round"),

    deadline: z
        .string()
        .min(1, "Deadline is required")
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .transform((val) => new Date(val))
        .refine((date) => date > new Date(), {
            message: "Deadline must be in the future",
        }),

    company_id: objectIdSchema,

    is_active: z.boolean().optional().default(true),
});

// Create Job
export const createJobSchema = z.object({
    body: jobBodySchema,
});

// Update Job (makes all fields optional)
export const updateJobSchema = z.object({
    body: jobBodySchema.partial(),
});

// Params validation (e.g., /api/jobs/:id)
export const jobParamsSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});
