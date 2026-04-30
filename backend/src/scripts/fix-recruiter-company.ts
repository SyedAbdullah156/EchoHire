import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.model";
import { Company } from "../models/company.model";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

async function fixRecruiter() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Find the recruiter
    const recruiter = await User.findOne({ role: "recruiter" });
    if (!recruiter) {
      console.log("No recruiter found in database.");
      process.exit(0);
    }
    console.log(`Found recruiter: ${recruiter.email} (${recruiter._id})`);

    // 2. Find or create a company
    let company = await Company.findOne();
    if (!company) {
      console.log("No company found. Creating 'EchoHire Tech'...");
      company = await Company.create({
        name: "EchoHire Tech",
        description: "AI-driven recruitment solutions.",
        owner_id: recruiter._id,
        industry: "Technology",
        size: "51-200 employees"
      });
    }
    console.log(`Using company: ${company.name} (${company._id})`);

    // 3. Link recruiter to company
    // Use direct update to bypass schema restrictions
    await (mongoose.connection.collection('users') as any).updateOne(
      { _id: recruiter._id },
      { $set: { company_id: company._id } }
    );

    console.log("Successfully linked recruiter to company via direct collection update!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing recruiter:", error);
    process.exit(1);
  }
}

fixRecruiter();
