import app from "./app";
import { connectDB } from "./config/db";
import { DEFAULT_PORT } from "./constants/app";

const PORT = process.env.PORT || DEFAULT_PORT;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
