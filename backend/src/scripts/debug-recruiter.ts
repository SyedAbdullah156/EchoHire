import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.model";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ role: "recruiter" });
  console.log(JSON.stringify(user, null, 2));
  process.exit(0);
}

run();
