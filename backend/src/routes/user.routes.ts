import express, { NextFunction, Response } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import {
  getMyProfile,
  updateMyProfile,
  updateAvatar,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import upload from "../config/multer.config";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../validations/user.validations";
import { uploadLogoToCloudinary } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// My profile
router.get("/me", protect, getMyProfile);
router.put(
    "/me",
    protect,
    validate(updateProfileSchema),
    updateMyProfile
);

// Upload Avatar
router.post(
    "/me/avatar",
    protect,
    upload.single("logo"),
    uploadLogoToCloudinary,
    updateAvatar
);

// Admin only
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id", protect, restrictTo("admin"), updateUser);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;