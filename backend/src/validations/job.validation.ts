import { z } from "zod";
import { RoundType } from "../constants/roundtypes.constants";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const createJobSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Job name is required" })
               .min(3, "Name must be at least 3 characters"),
               
        description: z.string({ required_error: "Job description is required" })
                      .max(2000, "Description is too long"),
                      
        role: z.string({ required_error: "Target role is required" }),
        
        framework: z.array(z.string(), { required_error: "Frameworks must be an array" })
                    .min(1, "At least one framework or technology must be specified"),
                    
        roundTypes: z.array(z.nativeEnum(RoundType as any), {
            required_error: "Assessment round types are required"
        }).min(1, "Please select at least one interview round type"),
        
        // We accept a string (date format) and convert it
        deadline: z.string({ required_error: "An application deadline is required" })
                   .refine((val) => !isNaN(Date.parse(val)), {
                       message: "Invalid date format for deadline"
                   }),
                   
        company_id: objectIdSchema,
        
        is_active: z.boolean().optional().default(true),
    }),
});

/**
 * USE CASE: Update Job
 * We use .partial() so that the user can send just the 'name' or just the 'role'
 * without being forced to send everything else.
 */
const updateJobSchema = createJobSchema.deepPartial();

/**
 * USE CASE: Get/Delete Single Job
 * Checks the URL parameters to ensure the ID is a valid MongoDB ID.
 */
const jobParamsSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export const JobValidations = {
    createJobSchema,
    updateJobSchema,
    jobParamsSchema
};