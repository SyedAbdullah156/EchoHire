import app from "./app";
import { connectDB } from "./config/db.config";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();