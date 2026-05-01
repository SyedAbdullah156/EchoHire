"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyInterviews = exports.getInterview = exports.createInterview = void 0;
const InterviewService = __importStar(require("../services/interview.services"));
const AppError_utils_1 = require("../utils/AppError.utils");
const createInterview = async (req, res, next) => {
    try {
        // Extract strictly what is allowed from the body
        const { job_id, cv_url } = req.body;
        // Extract user_id from the auth middleware
        const user_id = req.user?._id;
        if (!user_id) {
            throw new AppError_utils_1.AppError("Unauthorized access", 401);
        }
        const interview = await InterviewService.createInterviewService(job_id, user_id, cv_url);
        res.status(201).json({
            success: true,
            message: "Application submitted and interview initialized successfully",
            data: interview,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createInterview = createInterview;
const getInterview = async (req, res, next) => {
    try {
        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;
        if (!id) {
            throw new AppError_utils_1.AppError("Interview ID is required", 400);
        }
        const interview = await InterviewService.getInterviewByIdService(id);
        if (!req.user) {
            throw new AppError_utils_1.AppError("Authentication required", 401);
        }
        // Security Check: Only Admin or the Candidate who owns this interview can view it
        const isAdmin = req.user.role === "admin";
        const isOwner = interview.user_id._id.toString() === req.user._id.toString();
        if (!isAdmin && !isOwner) {
            throw new AppError_utils_1.AppError("Access denied", 403);
        }
        res.status(200).json({
            success: true,
            data: interview,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInterview = getInterview;
const getMyInterviews = async (req, res, next) => {
    try {
        const user_id = req.user?._id;
        if (!user_id) {
            throw new AppError_utils_1.AppError("Unauthorized access", 401);
        }
        const interviews = await InterviewService.getUserInterviewsService(user_id);
        res.status(200).json({
            success: true,
            data: interviews,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyInterviews = getMyInterviews;
