"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyParamsSchema = exports.updateCompanySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
const company_constants_1 = require("../constants/company.constants");
// Reusable ID validation
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
// Main Schema Validation
const companyBodySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Company name is required")
        .min(company_constants_1.COMPANY_LIMITS.NAME_MIN, `Min ${company_constants_1.COMPANY_LIMITS.NAME_MIN} chars`)
        .max(company_constants_1.COMPANY_LIMITS.NAME_MAX, `Max ${company_constants_1.COMPANY_LIMITS.NAME_MAX} chars`),
    description: zod_1.z
        .string()
        .trim()
        .min(company_constants_1.COMPANY_LIMITS.DESCRIPTION_MIN, `Min ${company_constants_1.COMPANY_LIMITS.DESCRIPTION_MIN} chars`)
        .max(company_constants_1.COMPANY_LIMITS.DESCRIPTION_MAX, `Max ${company_constants_1.COMPANY_LIMITS.DESCRIPTION_MAX} chars`)
        .optional(),
    website: zod_1.z
        .string()
        .trim()
        .url("Invalid website URL format")
        .optional()
        .or(zod_1.z.literal("")),
    logo: zod_1.z.string().optional(),
    owner_id: objectIdSchema.optional() // The controller can fill this from the authenticated user or a provided header/body value.
});
// Actual Use Cases
exports.createCompanySchema = zod_1.z.object({
    body: companyBodySchema,
});
exports.updateCompanySchema = zod_1.z.object({
    body: companyBodySchema.partial(),
});
exports.companyParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
});
