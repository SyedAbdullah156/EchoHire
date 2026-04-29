import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/company.routes";
import authRoutes from "./routes/auth.routes";
import upload from "./utils/multer.config";
import { globalErrorHandler } from "./middlewares/errors.middlewares";

const app = express();

// Middlewares
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
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
