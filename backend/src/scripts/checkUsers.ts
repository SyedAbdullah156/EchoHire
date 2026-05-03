import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/user.model";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/echohire";

async function checkUsers() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({}, 'email role password');
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

checkUsers();
