import { z } from "zod";
import { RoundType } from "../constants/roundtypes.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import { INTERVIEW_LIMITS } from "../constants/interview.constants";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const optionalUrl = z
    .string()
    .trim()
    .url("Invalid URL format")
    .optional()
    .or(z.literal(""));

const qaPairZodSchema = z.object({
    question: z.string().trim().min(1, "Question is required"),
    candidate_answer: z.string().trim().optional(),
    ai_evaluation: z.string().trim().optional(),
    timestamp: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
        .default(() => new Date().toISOString())
        .transform((val) => new Date(val)),
});

const roundZodSchema = z.object({
    type: z.nativeEnum(RoundType, {
        message: "Invalid round type",
    }),

    status: z
        .string()
        .optional()
        .refine((val) => !val || ROUND_STATUS.includes(val as any), {
            message: "Invalid round status",
        }),

    qa_pairs: z.array(qaPairZodSchema).default([]),

    max_questions: z
        .number()
        .min(1, "Max questions must be at least 1")
        .max(15, "Max questions cannot exceed 15"),

    score: z
        .number()
        .min(0, `Min score is 0`)
        .max(100, `Max score is 100`)
        .optional(),

    remarks: z
        .string()
        .trim()
        .min(
            INTERVIEW_LIMITS.REMARKS_MIN,
            `Min ${INTERVIEW_LIMITS.REMARKS_MIN} chars`,
        )
        .max(
            INTERVIEW_LIMITS.REMARKS_MAX,
            `Max ${INTERVIEW_LIMITS.REMARKS_MAX} chars`,
        )
        .optional(),
});

const violationZodSchema = z.object({
    type: z.enum([...VIOLATION_TYPES] as [string, ...string[]], {
        message: "Invalid violation type",
    }),

    timestamp: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
        .transform((val) => new Date(val))
        .optional(),
});

const interviewBodySchema = z.object({
    job_id: objectIdSchema,
    user_id: objectIdSchema,

    status: z
        .string()
        .optional()
        .refine((val) => !val || INTERVIEW_STATUS.includes(val as any), {
            message: "Invalid interview status",
        }),

    rounds: z
        .array(roundZodSchema)
        .min(1, "At least one interview round is required"),

    cv_url: optionalUrl,

    score: z
        .number()
        .min(0, `Min score is 0`)
        .max(100, `Max score is 100`)
        .optional(),

    remarks: z
        .string()
        .trim()
        .min(
            INTERVIEW_LIMITS.REMARKS_MIN,
            `Min ${INTERVIEW_LIMITS.REMARKS_MIN} chars`,
        )
        .max(
            INTERVIEW_LIMITS.REMARKS_MAX,
            `Max ${INTERVIEW_LIMITS.REMARKS_MAX} chars`,
        )
        .optional(),

    violations: z.array(violationZodSchema).optional(),
});

/**
 * We only need the job_id (and optionally CV).
 * Everything else is handled by the createInterviewService logic.
 */
export const createInterviewSchema = z.object({
    body: z.object({
        job_id: objectIdSchema,
        cv_url: optionalUrl,
    }),
});

/**
 * Used for updating interview details (admin/system use)
 */
export const updateInterviewSchema = z.object({
    body: interviewBodySchema.partial(),
});

/**
 * URL Parameter validation
 */
export const interviewParamsSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});
