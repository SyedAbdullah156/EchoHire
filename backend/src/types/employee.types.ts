import mongoose from "mongoose";
import { TUser } from "./user.types";

export interface TEmployeeNotifications {
    email?: boolean;
    desktop?: boolean;
    marketing?: boolean;
}

export interface TEmployee extends TUser {
    company_id?: mongoose.Types.ObjectId;
    jobTitle?: string;
    recruitingFocus?: string;
    bio?: string;
    notifications?: TEmployeeNotifications;
}
