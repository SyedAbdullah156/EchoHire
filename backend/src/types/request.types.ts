import { Request } from "express";
import { UserDocument } from "./user.types";

// Custom request type with user property
export interface AuthRequest extends Request {
    user: UserDocument;
    file?: Express.Multer.File;
}
