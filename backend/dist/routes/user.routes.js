"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const user_validations_1 = require("../validations/user.validations");
const cloudinary_middleware_1 = require("../middlewares/cloudinary.middleware");
const router = express_1.default.Router();
// My profile
router.get("/me", auth_middleware_1.protect, user_controller_1.getMyProfile);
router.put("/me", auth_middleware_1.protect, (0, validate_middleware_1.validate)(user_validations_1.updateProfileSchema), user_controller_1.updateMyProfile);
// Upload Avatar
router.post("/me/avatar", auth_middleware_1.protect, multer_config_1.default.single("logo"), cloudinary_middleware_1.uploadLogoToCloudinary, user_controller_1.updateAvatar);
// Admin only
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.getAllUsers);
router.get("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.getUserById);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.updateUser);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), user_controller_1.deleteUser);
exports.default = router;
