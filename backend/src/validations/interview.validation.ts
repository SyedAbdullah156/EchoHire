import { z } from "zod";
import { RoundType } from "../constants/roundtypes.constants";
import { VIOLATION_TYPES } from "../constants/violations.constants";
import { ROUND_STATUS, INTERVIEW_STATUS } from "../constants/status.constants";
import { INTERVIEW_LIMITS } from "../constants/interview.constants";

// Reusable ID validation
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// Sub-Schemas Validation
const roundZodSchema = z.object({
    type: z.nativeEnum(RoundType).optional(),

    score: z
        .number()
        .min(
            INTERVIEW_LIMITS.SCORE_MIN,
            `Min score is ${INTERVIEW_LIMITS.SCORE_MIN}`,
        )
        .max(
            INTERVIEW_LIMITS.SCORE_MAX,
            `Max score is ${INTERVIEW_LIMITS.SCORE_MAX}`,
        )
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

    status: z.enum([...ROUND_STATUS] as [string, ...string[]]).optional(),
});

const violationZodSchema = z.object({
    type: z.enum([...VIOLATION_TYPES] as [string, ...string[]]).optional(),

    timestamp: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
        .transform((val) => new Date(val))
        .optional(),
});

// Main Schema Validaion
const interviewBodySchema = z.object({
    job_id: objectIdSchema,
    user_id: objectIdSchema,

    rounds: z
        .array(roundZodSchema)
        .min(1, "At least one interview round must be provided"),

    cv_url: z.string().url("Invalid CV URL format").optional(),

    score: z
        .number()
        .min(
            INTERVIEW_LIMITS.SCORE_MIN,
            `Min score is ${INTERVIEW_LIMITS.SCORE_MIN}`,
        )
        .max(
            INTERVIEW_LIMITS.SCORE_MAX,
            `Max score is ${INTERVIEW_LIMITS.SCORE_MAX}`,
        )
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

    status: z.enum([...INTERVIEW_STATUS] as [string, ...string[]]).optional(),

    violations: z.array(violationZodSchema).optional(),
});

// Actual Use Cases
export const createInterviewSchema = z.object({
    body: interviewBodySchema,
});

export const updateInterviewSchema = z.object({
    body: interviewBodySchema.partial(),
});

export const interviewParamsSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});
