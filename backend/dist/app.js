"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const aiInterview_routes_1 = __importDefault(require("./routes/aiInterview.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const linkedinOptimizer_routes_1 = __importDefault(require("./routes/linkedinOptimizer.routes"));
const cors_1 = __importDefault(require("cors"));
require("./config/env.config");
const errors_middleware_1 = require("./middlewares/errors.middleware");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "2mb" }));
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
    : ["http://localhost:3000", "http://127.0.0.1:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (Postman, mobile apps)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options("/{*any}", (0, cors_1.default)(corsOptions)); // Express 5-compatible preflight wildcard
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/companies", company_routes_1.default);
app.use("/api/jobs", job_routes_1.default);
app.use("/api/interview", interview_routes_1.default);
app.use("/api/aiInterview", aiInterview_routes_1.default);
app.use("/api/linkedin", linkedinOptimizer_routes_1.default);
app.use("/api/resume", resume_routes_1.default);
app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "EchoHire backend is healthy" });
});
// Error Handler
app.use(errors_middleware_1.globalErrorHandler);
exports.default = app;
