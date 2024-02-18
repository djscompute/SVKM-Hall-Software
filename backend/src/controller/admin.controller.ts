import { Request, Response } from "express";
import logger from "../utils/logger";
import createUser from "../service/createAdmin";
import authenticateUser from "../service/authAdmin";
import { signAccessToken, signRefreshToken } from "../utils/signToken";
import getUserData from "../service/getAdminData";
import { createSession } from "../service/createSession";
import { deleteSession } from "../service/deleteSession";
import { AuthenticatedRequest } from "../types/requests";

export async function createAdminHandler(req: Request, res: Response) {
  try {
    const userInstance = await createUser(req.body);

    res.status(200).json(userInstance);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function loginAdminHandler(req: Request, res: Response) {
  try {
    const userInstance = await authenticateUser(req.body);

    //Signing Jwts
    signAccessToken(res, {
      email: userInstance.email,
      username: userInstance.username,
      role: userInstance.role,
    });
    signRefreshToken(res, {
      email: userInstance.email,
      username: userInstance.username,
      role: userInstance.role,
    });

    //Creating a new session
    // await createSession(req,req.body.email,refreshToken)

    res.status(200).json(userInstance);
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(409).json({ error: "User with this email already exists" });
    }
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function getAdminHandler(req: Request, res: Response) {
  // get the info of the admin
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const email: string = authenticatedReq.userEmail;
    const userInstance = await getUserData(email);

    // if (!userInstance) res.status(404).json({ error: "User not found" });

    res.status(200).json(userInstance);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function logoutAdminHandler(req: Request, res: Response) {
  try {
    //Clearing Cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //Deleting Session
    //@ts-ignore
    // await deleteSession(req.userEmail);

    res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}
