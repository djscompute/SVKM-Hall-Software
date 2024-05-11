import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userEmail: string;
  userRole: string;
  userName: string;
}
