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
exports.getRound = exports.voiceAnswer = exports.answerInRound = exports.startRound = void 0;
const AppError_utils_1 = require("../utils/AppError.utils");
const AiService = __importStar(require("../services/aiInterview.services"));
const getNormalizedParam = (value) => {
    if (Array.isArray(value))
        return value[0] ?? "";
    return value ?? "";
};
const startRound = async (req, res, next) => {
    try {
        if (!req.user?._id)
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId)
            throw new AppError_utils_1.AppError("Interview ID is required", 400);
        const data = await AiService.startRoundService(interviewId, Number(req.params.roundIndex), req.user._id);
        res.status(200).json({
            success: true,
            message: "Round started",
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.startRound = startRound;
const answerInRound = async (req, res, next) => {
    try {
        if (!req.user?._id)
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId)
            throw new AppError_utils_1.AppError("Interview ID is required", 400);
        const data = await AiService.answerInRoundService(interviewId, Number(req.params.roundIndex), req.body.content, req.user._id);
        res.status(200).json({
            success: true,
            message: "Answer submitted",
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.answerInRound = answerInRound;
const voiceAnswer = async (req, res, next) => {
    try {
        if (!req.user?._id)
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        if (!req.file)
            throw new AppError_utils_1.AppError("Audio file is required", 400);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId)
            throw new AppError_utils_1.AppError("Interview ID is required", 400);
        const data = await AiService.answerInRoundService(interviewId, Number(req.params.roundIndex), undefined, // No text content
        req.user._id, req.file.buffer);
        res.status(200).json({
            success: true,
            message: "Voice answer processed",
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.voiceAnswer = voiceAnswer;
const getRound = async (req, res, next) => {
    try {
        if (!req.user?._id)
            throw new AppError_utils_1.AppError("Unauthorized", 401);
        const interviewId = getNormalizedParam(req.params.interviewId);
        if (!interviewId)
            throw new AppError_utils_1.AppError("Interview ID is required", 400);
        const data = await AiService.getRoundService(interviewId, Number(req.params.roundIndex), req.user._id);
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRound = getRound;
