import { Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AuthRequest } from "../types/request.types";

export const validate =
    (schema: ZodSchema) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // Skip automatic file path assignment here as it's handled 
            // specifically by cloudinary middlewares for different fields.

            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.issues.map((err) => ({
                        field: err.path[err.path.length - 1],
                        message: err.message,
                    })),
                });
            }

            next(error);
        }
    };
