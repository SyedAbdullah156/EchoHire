import { Router } from "express";
import * as CandidateController from "../controllers/candidate.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateCandidateProfileSchema } from "../validations/candidate.validation";
import { objectIdSchema } from "../validations/common.validation";
import upload from "../config/multer.config";
import { uploadLogoToCloudinary } from "../middlewares/cloudinary.middleware";

const router = Router();

router.use(protect);

// Admin-only management
router.get("/", restrictTo("admin"), CandidateController.getAllCandidates);
router.delete(
    "/:id",
    restrictTo("admin"),
    validate(objectIdSchema),
    CandidateController.deleteCandidateById,
);

// Candidate Only Routes
router.use(restrictTo("candidate"));

router
    .route("/me")
    .get(CandidateController.getMyCandidateProfile)
    .put(
        validate(updateCandidateProfileSchema),
        CandidateController.updateMyCandidateProfile,
    )
    .delete(CandidateController.deleteMyCandidateProfile);

router.post(
    "/me/avatar",
    upload.single("logo"),
    uploadLogoToCloudinary,
    CandidateController.updateAvatar,
);

export default router;
