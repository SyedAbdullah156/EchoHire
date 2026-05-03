import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { getAdminStats } from "../controllers/admin.controller";

const router = express.Router();

router.get("/stats", protect, restrictTo("admin"), getAdminStats);

export default router;
