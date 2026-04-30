import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

const clearAllData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for total cleanup...");

        const db = mongoose.connection.db as any;
        const collections = await db.listCollections().toArray();
        
        for (const collection of collections) {
            console.log(`Clearing collection: ${collection.name}`);
            await db.collection(collection.name).deleteMany({});
        }

        console.log("All records in all collections have been deleted.");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

clearAllData();
