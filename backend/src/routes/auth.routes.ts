import express from "express";
import { login, register, googleLogin, forgotPassword, resetPassword, changePassword, setupMFA, verifyMFA, loginVerifyMFA, disableMFA } from "../services/auth.services";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema, googleAuthSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/user.validations";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/login-mfa", loginVerifyMFA);
router.post("/google", validate(googleAuthSchema), googleLogin);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/mfa/setup", protect, setupMFA);
router.post("/mfa/verify", protect, verifyMFA);
router.post("/mfa/disable", protect, disableMFA);

export default router;
