"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const company_validation_1 = require("../validations/company.validation");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const cloudinary_middleware_1 = require("../middlewares/cloudinary.middleware");
const router = express_1.default.Router();
/**
 * PUBLIC ROUTES
 * Anyone can view companies (like a job board)
 */
router.get("/", company_controller_1.getAllCompanies);
router.get("/:id", company_controller_1.getCompanyById);
/**
 * PROTECTED ROUTES
 * It checks the JWT in the header. If the token is missing or invalid, it kills the request here. If valid, it attaches req.user (the logged-in user) to the authenticated request.
 */
router.post("/", auth_middleware_1.protect, // 1. Check who the user is (Sets req.user)
multer_config_1.default.single("logo"), // 2. Read the form data (Text -> req.body, Image -> req.file.buffer)
(0, validate_middleware_1.validate)(company_validation_1.createCompanySchema), // 3. Zod checks req.body
cloudinary_middleware_1.uploadLogoToCloudinary, // 4. Upload buffer to Cloudinary, put URL into req.body.logo
company_controller_1.createCompany // 5. Save everything to MongoDB!
);
router.patch("/:id", auth_middleware_1.protect, multer_config_1.default.single("logo"), (0, validate_middleware_1.validate)(company_validation_1.updateCompanySchema), cloudinary_middleware_1.uploadLogoToCloudinary, company_controller_1.updateCompany);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("admin"), company_controller_1.deleteCompany);
exports.default = router;
