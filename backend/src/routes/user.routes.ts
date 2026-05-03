import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import {
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { objectIdSchema } from "../validations/common.validation";

const router = express.Router();

// My profile
router.get("/me", protect, getMyProfile);

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

export default router;
