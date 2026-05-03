import { z } from "zod";
import { COMPANY_LIMITS } from "../constants/company.constants";

// Main Schema Validation
const companyBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Company name is required")
        .min(COMPANY_LIMITS.NAME_MIN, `Min ${COMPANY_LIMITS.NAME_MIN} chars`)
        .max(COMPANY_LIMITS.NAME_MAX, `Max ${COMPANY_LIMITS.NAME_MAX} chars`),

    description: z
        .string()
        .trim()
        .min(
            COMPANY_LIMITS.DESCRIPTION_MIN,
            `Min ${COMPANY_LIMITS.DESCRIPTION_MIN} chars`,
        )
        .max(
            COMPANY_LIMITS.DESCRIPTION_MAX,
            `Max ${COMPANY_LIMITS.DESCRIPTION_MAX} chars`,
        )
        .optional(),

    website: z
        .string()
        .trim()
        .url("Invalid website URL format")
        .optional()
        .or(z.literal("")),

    logo: z.string().optional(),

    size: z.string().trim().max(50, "Company size must be at most 50 characters").optional(),
    industry: z.string().trim().max(100, "Industry must be at most 100 characters").optional(),
});

// Actual Use Cases
export const createCompanySchema = z.object({
    body: companyBodySchema.strict(),
});

export const updateCompanySchema = z.object({
    body: companyBodySchema.partial().strict(),
});