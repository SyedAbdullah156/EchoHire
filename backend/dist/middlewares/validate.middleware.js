"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        if (req.file) {
            req.body.logo = req.file.path;
        }
        await schema.parseAsync({
            body: req.body,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
exports.validate = validate;
