import "./config/env.config";
import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import jobRoutes from "./routes/job.routes";
import interviewRoutes from "./routes/interview.routes";
import aiInterviewRoutes from "./routes/aiInterview.routes";
import resumeRoutes from "./routes/resume.routes";
import authRoutes from "./routes/auth.routes";
import candidateRoutes from "./routes/candidate.routes";
import employeeRoutes from "./routes/employee.routes";
import linkedinOptimizerRoutes from "./routes/linkedinOptimizer.routes";
import codingRoutes from "./routes/coding.routes";
import notificationRoutes from "./routes/notification.routes";
import "./models/candidate.model";
import "./models/employee.model";
import "./models/admin.model";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errors.middleware";
const app = express();

app.use((req, res, next) => {
    console.log(`[BACKEND] ${req.method} ${req.originalUrl}`);
    next();
});

// Middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/linkedin", linkedinOptimizerRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resume", resumeRoutes);
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "EchoHire backend is healthy" });
});

// Error Handler
app.use(globalErrorHandler);

export default app;