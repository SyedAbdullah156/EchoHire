import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.model";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ADMIN_EMAIL = "admin@echohire.ai";
const ADMIN_PASSWORD = "AdminPassword123!";

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating password...");
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash(ADMIN_PASSWORD, salt);
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin password updated successfully.");
    } else {
      console.log("Creating new admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await User.create({
        name: "System Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created successfully.");
    }

    console.log("--------------------------------");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("--------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
