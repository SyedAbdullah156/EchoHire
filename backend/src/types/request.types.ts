import { Request } from 'express';
import { TUser } from './user.types';

// Custom request type with user property
export interface AuthRequest extends Request {
    user?: TUser;
}