"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = __importDefault(require("../config/multer.config"));
const linkedinOptimizer_controller_1 = require("../controllers/linkedinOptimizer.controller");
const router = express_1.default.Router();
// Upload a LinkedIn PDF export and get Gemini analysis
router.post("/analyze-pdf", multer_config_1.default.single("file"), linkedinOptimizer_controller_1.analyzeLinkedinPdf);
exports.default = router;
