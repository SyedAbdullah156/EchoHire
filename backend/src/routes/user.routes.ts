import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

// My profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Admin only
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id", protect, restrictTo("admin"), updateUser);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;