import { Request } from "express";
import { TEmployee } from "./employee.types";
import { TCandidate } from "./candidate.types";
import { TUser } from "./user.types";

// Custom request type with user property
export interface AuthRequest extends Request {
    user?: TCandidate | TEmployee | TUser;
    file?: Express.Multer.File;
}
