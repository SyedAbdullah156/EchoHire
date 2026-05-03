import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import {
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateMe,
    updateMyAvatar,
    getPendingRecruiters,
    approveRecruiter,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { objectIdSchema } from "../validations/common.validation";
import upload from "../config/multer.config";
import { uploadLogoToCloudinary } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// My profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMe);
router.post("/me/avatar", protect, upload.single("logo"), uploadLogoToCloudinary, updateMyAvatar);

// Admin only
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get(
    "/:id",
    protect,
    restrictTo("admin"),
    validate(objectIdSchema),
    getUserById,
);
router.put(
    "/:id",
    protect,
    restrictTo("admin"),
    validate(objectIdSchema),
    updateUser,
);
router.delete(
    "/:id",
    protect,
    restrictTo("admin"),
    validate(objectIdSchema),
    deleteUser,
);

// Moderation
router.get("/pending-recruiters", protect, restrictTo("admin"), getPendingRecruiters);
router.put("/approve/:id", protect, restrictTo("admin"), validate(objectIdSchema), approveRecruiter);

export default router;
