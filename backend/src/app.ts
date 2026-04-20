import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

// 
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

export default app;
