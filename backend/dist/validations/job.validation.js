"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobParamsSchema = exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
const roundtypes_constants_1 = require("../constants/roundtypes.constants");
const job_constants_1 = require("../constants/job.constants");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const jobRoundSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(roundtypes_constants_1.RoundType, {
        message: "Invalid round type selected",
    }),
    max_questions: zod_1.z
        .number()
        .min(1, "Must ask at least 1 question")
        .max(15, "Cannot exceed 15 questions per round")
        .default(5),
});
const jobBodySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Name is required")
        .min(job_constants_1.JOB_LIMITS.NAME_MIN, `Min ${job_constants_1.JOB_LIMITS.NAME_MIN} chars`)
        .max(job_constants_1.JOB_LIMITS.NAME_MAX, `Max ${job_constants_1.JOB_LIMITS.NAME_MAX} chars`),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(job_constants_1.JOB_LIMITS.DESCRIPTION_MIN, `Min ${job_constants_1.JOB_LIMITS.DESCRIPTION_MIN} chars`)
        .max(job_constants_1.JOB_LIMITS.DESCRIPTION_MAX, `Max ${job_constants_1.JOB_LIMITS.DESCRIPTION_MAX} chars`),
    role: zod_1.z
        .string()
        .trim()
        .min(1, "Role is required")
        .min(job_constants_1.JOB_LIMITS.ROLE_MIN, `Min ${job_constants_1.JOB_LIMITS.ROLE_MIN} chars`)
        .max(job_constants_1.JOB_LIMITS.ROLE_MAX, `Max ${job_constants_1.JOB_LIMITS.ROLE_MAX} chars`),
    framework: zod_1.z
        .array(zod_1.z.string().min(1, "Framework name cannot be empty"))
        .min(job_constants_1.JOB_LIMITS.FRAMEWORK_MIN, "At least one framework is required"),
    rounds: zod_1.z
        .array(jobRoundSchema)
        .min(job_constants_1.JOB_LIMITS.ROUNDS_MIN, "Define at least one interview round"),
    deadline: zod_1.z
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
    is_active: zod_1.z.boolean().optional().default(true),
});
// Create Job
exports.createJobSchema = zod_1.z.object({
    body: jobBodySchema,
});
// Update Job (makes all fields optional)
exports.updateJobSchema = zod_1.z.object({
    body: jobBodySchema.partial(),
});
// Params validation (e.g., /api/jobs/:id)
exports.jobParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
});
