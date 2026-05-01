import express from "express";
import { login, register } from "../services/auth.services";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/user.validations";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;