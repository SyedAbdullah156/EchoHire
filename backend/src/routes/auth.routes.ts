import express from "express";
import { login, register, googleLogin, forgotPassword, resetPassword } from "../services/auth.services";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema, googleAuthSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/user.validations";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleAuthSchema), googleLogin);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;