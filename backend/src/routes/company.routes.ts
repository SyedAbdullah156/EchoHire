import express from "express";
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../controllers/company.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createCompanySchema,
    updateCompanySchema,
} from "../validations/company.validation";
import upload from "../config/multer.config";
import { uploadLogoToCloudinary } from "../middlewares/cloudinary.middleware";
import { objectIdSchema } from "../validations/common.validation";

const router = express.Router();

/**
 * PUBLIC ROUTES
 * Anyone can view companies (like a job board)
 */
router.get("/", getAllCompanies);
router.get("/:id", validate(objectIdSchema), getCompanyById);

/**
 * PROTECTED ROUTES
 * It checks the JWT in the header. If the token is missing or invalid, it kills the request here. If valid, it attaches req.user (the logged-in user) to the authenticated request.
 */

router.post(
    "/",
    protect, // 1. Check who the user is (Sets req.user)
    upload.single("logo"), // 2. "logo" is name of field that contains file. It read the form data (Text -> req.body, Image -> req.file.buffer)
    validate(createCompanySchema), // 3. Zod checks req.body
    uploadLogoToCloudinary, // 4. Upload buffer to Cloudinary, put URL into req.body.logo
    createCompany, // 5. Save everything to MongoDB!
);

router.patch(
    "/:id",
    protect,
    upload.single("logo"),
    validate(updateCompanySchema),
    uploadLogoToCloudinary,
    updateCompany,
);

router.delete("/:id", protect, restrictTo("admin"), validate(objectIdSchema), deleteCompany);

export default router;
