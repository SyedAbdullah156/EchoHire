import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

export const Admin = User.discriminator("admin", new Schema({}, { _id: false }));