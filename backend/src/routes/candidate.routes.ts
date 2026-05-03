import { Router } from "express";
import * as CandidateController from "../controllers/candidate.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateCandidateProfileSchema } from "../validations/candidate.validation";
import upload from "../config/multer.config";
import { uploadLogoToCloudinary } from "../middlewares/cloudinary.middleware";

const router = Router();

router.use(protect);
router.use(restrictTo("candidate"));

router
    .route("/me")
    .get(CandidateController.getMyCandidateProfile)
    .put(validate(updateCandidateProfileSchema), CandidateController.updateMyCandidateProfile);

router.post(
    "/me/avatar",
    upload.single("logo"),
    uploadLogoToCloudinary,
    CandidateController.updateAvatar,
);

export default router;
