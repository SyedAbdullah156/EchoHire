import { Request } from 'express';
import { IUser } from './user.types';

// Custom request type with user property
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}