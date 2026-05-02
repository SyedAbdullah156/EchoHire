import { z } from "zod";

// This is just the 24-char string validator (Used inside body schemas)
export const mongoIdString = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// This is for Express Params validator (Used inside router.get('/:id', ...))
export const objectIdSchema = z.object({
    params: z.object({
        id: mongoIdString
    })
});