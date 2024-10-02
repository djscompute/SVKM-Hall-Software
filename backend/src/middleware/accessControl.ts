import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types/requests";

// Middleware function to check if the user has master role
// before calling this you need to call Validate Cookie
export const requireMasterRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (authenticatedReq.userRole !== "MASTER") {
    return res
      .status(403)
      .json({ message: "Access denied. MASTER role required" });
  }
  next();
};

// Middleware function to check if the user has manager role
// before calling this you need to call Validate Cookie
export const requireManagerRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (
    authenticatedReq.userRole == "MANAGER" ||
    authenticatedReq.userRole == "MASTER"
  ) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. MANAGER role required" });
  }
};
