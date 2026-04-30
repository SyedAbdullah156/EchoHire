import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller";

const router = express.Router();

// Get current user's profile
router.get("/me", protect, getMyProfile);

// Update current user's profile
router.put("/me", protect, updateMyProfile);

export default router;
