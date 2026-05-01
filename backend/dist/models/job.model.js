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
exports.Job = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const roundtypes_constants_1 = require("../constants/roundtypes.constants");
const jobRoundSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(roundtypes_constants_1.RoundType), required: true },
    max_questions: {
        type: Number,
        required: true,
        min: 1,
        max: 15,
        default: 5,
    },
}, { _id: false });
const jobSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    role: { type: String, required: true },
    framework: [{ type: String }],
    rounds: { type: [jobRoundSchema], required: true },
    deadline: { type: Date, required: true },
    company_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });
exports.Job = mongoose_1.default.model("Job", jobSchema);
