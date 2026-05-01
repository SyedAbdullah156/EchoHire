import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import interviewRoutes from "./routes/interview.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import "./config/env.config";
import { globalErrorHandler } from "./middlewares/errors.middleware";

const app = express();

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
app.options("*", cors(corsOptions)); // handle preflight

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interview", interviewRoutes);
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "EchoHire backend is healthy" });
});

// Error Handler
app.use(globalErrorHandler);

export default app;