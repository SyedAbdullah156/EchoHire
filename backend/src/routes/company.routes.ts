import express from "express";
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    deleteCompanyById,
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

// Public Routes
router.get("/", getAllCompanies);
router.get("/:id", validate(objectIdSchema), getCompanyById);

// Admin-only management routes
router.delete(
    "/:id", 
    protect, 
    restrictTo("admin"), 
    validate(objectIdSchema), 
    deleteCompanyById
);

// Recruiter Only routes
router.use(protect, restrictTo("recruiter"));

router.post(
    "/",
    upload.single("logo"),
    validate(createCompanySchema),
    uploadLogoToCloudinary,
    createCompany,
);

router.patch(
    "/",
    upload.single("logo"),
    validate(updateCompanySchema),
    uploadLogoToCloudinary,
    updateCompany,
);

router.delete(
    "/",
    deleteCompany
);

export default router;
