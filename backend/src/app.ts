import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import upload from "./utils/multer.config";
import { globalErrorHandler } from "./middlewares/errors.middlewares";

const app = express();

// Middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
// Enable CORS for frontend during development
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/profile", profileRoutes);
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "EchoHire backend is healthy" });
});
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
    console.log(req.file);   // file data
    console.log(req.body);   // text fields
    res.status(200).json({ success: true, message: "File uploaded" });
});

// Error Handler
app.use(globalErrorHandler);
 
export default app;
