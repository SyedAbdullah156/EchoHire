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
exports.Interview = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const roundtypes_constants_1 = require("../constants/roundtypes.constants");
const violations_constants_1 = require("../constants/violations.constants");
const status_constants_1 = require("../constants/status.constants");
const qaPairSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    candidate_answer: {
        type: String,
    },
    ai_evaluation: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const violationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: {
            values: violations_constants_1.VIOLATION_TYPES,
            message: "{VALUE} is not a recognized violation type",
        },
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const roundSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: {
            values: Object.values(roundtypes_constants_1.RoundType),
            message: "{VALUE} is not a valid round type",
        },
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: status_constants_1.ROUND_STATUS,
            message: "{VALUE} is not a valid round status",
        },
        default: "pending",
    },
    qa_pairs: {
        type: [qaPairSchema],
        default: [],
    },
    max_questions: {
        type: Number,
        required: true,
        default: 5,
        min: 1,
        max: 15,
    },
    score: {
        type: Number,
        min: [0, "Score cannot be less than 0"],
        max: [100, "Score cannot exceed 100"],
    },
    remarks: {
        type: String,
        trim: true,
    },
}, { _id: false });
const interviewSchema = new mongoose_1.Schema({
    job_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Job",
        required: [true, "An interview must be linked to a specific job"],
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "An interview must be linked to a candidate"],
    },
    status: {
        type: String,
        enum: {
            values: status_constants_1.INTERVIEW_STATUS,
            message: "{VALUE} is not a valid interview status",
        },
        default: "applied",
    },
    rounds: {
        type: [roundSchema],
        default: [],
    },
    cv_url: {
        type: String,
    },
    score: {
        type: Number,
        min: [0, "Score cannot be less than 0"],
        max: [100, "Score cannot exceed 100"],
    },
    remarks: {
        type: String,
        trim: true,
    },
    violations: {
        type: [violationSchema],
        default: [],
    },
}, { timestamps: true });
exports.Interview = mongoose_1.default.model("Interview", interviewSchema);
