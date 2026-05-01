"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../services/auth.services");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const user_validations_1 = require("../validations/user.validations");
const router = express_1.default.Router();
router.post("/register", (0, validate_middleware_1.validate)(user_validations_1.registerSchema), auth_services_1.register);
router.post("/login", (0, validate_middleware_1.validate)(user_validations_1.loginSchema), auth_services_1.login);
exports.default = router;
