import { Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AuthRequest } from "../types/request.types";

export const validate =
    (schema: ZodSchema) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (req.file) {
                req.body.logo = req.file.path;
            }

            await schema.parseAsync({
                body: req.body,
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
