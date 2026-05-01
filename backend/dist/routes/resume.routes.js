"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_config_1 = __importDefault(require("../config/multer.config"));
const resume_controller_1 = require("../controllers/resume.controller");
const router = (0, express_1.Router)();
router.post("/scan", auth_middleware_1.protect, multer_config_1.default.single("resume"), resume_controller_1.scanResume);
exports.default = router;
