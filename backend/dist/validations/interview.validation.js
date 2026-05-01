"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewParamsSchema = exports.updateInterviewSchema = exports.createInterviewSchema = void 0;
const zod_1 = require("zod");
const roundtypes_constants_1 = require("../constants/roundtypes.constants");
const violations_constants_1 = require("../constants/violations.constants");
const status_constants_1 = require("../constants/status.constants");
const interview_constants_1 = require("../constants/interview.constants");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const optionalUrl = zod_1.z
    .string()
    .trim()
    .url("Invalid URL format")
    .optional()
    .or(zod_1.z.literal(""));
const qaPairZodSchema = zod_1.z.object({
    question: zod_1.z.string().trim().min(1, "Question is required"),
    candidate_answer: zod_1.z.string().trim().optional(),
    ai_evaluation: zod_1.z.string().trim().optional(),
    timestamp: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
        .transform((val) => new Date(val))
        .optional()
        .default(() => new Date()),
});
const roundZodSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(roundtypes_constants_1.RoundType, {
        message: "Invalid round type",
    }),
    status: zod_1.z
        .string()
        .optional()
        .refine((val) => !val || status_constants_1.ROUND_STATUS.includes(val), {
        message: "Invalid round status",
    }),
    qa_pairs: zod_1.z.array(qaPairZodSchema).default([]),
    max_questions: zod_1.z
        .number()
        .min(1, "Max questions must be at least 1")
        .max(15, "Max questions cannot exceed 15"),
    score: zod_1.z
        .number()
        .min(0, `Min score is 0`)
        .max(100, `Max score is 100`)
        .optional(),
    remarks: zod_1.z
        .string()
        .trim()
        .min(interview_constants_1.INTERVIEW_LIMITS.REMARKS_MIN, `Min ${interview_constants_1.INTERVIEW_LIMITS.REMARKS_MIN} chars`)
        .max(interview_constants_1.INTERVIEW_LIMITS.REMARKS_MAX, `Max ${interview_constants_1.INTERVIEW_LIMITS.REMARKS_MAX} chars`)
        .optional(),
});
const violationZodSchema = zod_1.z.object({
    type: zod_1.z.enum([...violations_constants_1.VIOLATION_TYPES], {
        message: "Invalid violation type",
    }),
    timestamp: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
        .transform((val) => new Date(val))
        .optional(),
});
const interviewBodySchema = zod_1.z.object({
    job_id: objectIdSchema,
    user_id: objectIdSchema,
    status: zod_1.z
        .string()
        .optional()
        .refine((val) => !val || status_constants_1.INTERVIEW_STATUS.includes(val), {
        message: "Invalid interview status",
    }),
    rounds: zod_1.z
        .array(roundZodSchema)
        .min(1, "At least one interview round is required"),
    cv_url: optionalUrl,
    score: zod_1.z
        .number()
        .min(0, `Min score is 0`)
        .max(100, `Max score is 100`)
        .optional(),
    remarks: zod_1.z
        .string()
        .trim()
        .min(interview_constants_1.INTERVIEW_LIMITS.REMARKS_MIN, `Min ${interview_constants_1.INTERVIEW_LIMITS.REMARKS_MIN} chars`)
        .max(interview_constants_1.INTERVIEW_LIMITS.REMARKS_MAX, `Max ${interview_constants_1.INTERVIEW_LIMITS.REMARKS_MAX} chars`)
        .optional(),
    violations: zod_1.z.array(violationZodSchema).optional(),
});
/**
 * We only need the job_id (and optionally CV).
 * Everything else is handled by the createInterviewService logic.
 */
exports.createInterviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        job_id: objectIdSchema,
        cv_url: optionalUrl,
    }),
});
/**
 * Used for updating interview details (admin/system use)
 */
exports.updateInterviewSchema = zod_1.z.object({
    body: interviewBodySchema.partial(),
});
/**
 * URL Parameter validation
 */
exports.interviewParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
});
