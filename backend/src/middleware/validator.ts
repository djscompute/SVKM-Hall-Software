import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import jwt from "jsonwebtoken";
import config from "config";
import { signAccessToken, signRefreshToken } from "../utils/signToken";
import { jwtPayloadToken } from "../types/jwtPayload";
import logger from "../utils/logger";

// Zod Schema Validation
export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
}

///Cookie
//Types
type CookieType = {
  accessToken: string;
  refreshToken: string;
};

const PRIVATE_KEY = config.get<string>("PRIVATE_KEY");
const PRIVATE_REFRESH_KEY = config.get<string>("PRIVATE_REFRESH_KEY");

export function validateCookie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore
    const { accessToken, refreshToken }: CookieType = req.cookies;
    //Verify Access Token
    jwt.verify(
      accessToken,
      PRIVATE_KEY,
      (error: jwt.VerifyErrors | null, decoded) => {
        if (!error) {
          const { email, role, username } = decoded as jwtPayloadToken;
          //@ts-ignore
          req.userEmail = email;
          //@ts-ignore
          req.userRole = role;
          //@ts-ignore
          req.userName = username;
          return next();
        } else if (error?.name === "TokenExpiredError") {
          //Verify Refresh Token
          const { username, email, role } = jwt.verify(
            refreshToken,
            PRIVATE_REFRESH_KEY
          ) as jwtPayloadToken;

          //Sign new cookies
          signAccessToken(res, { username, email, role });
          signRefreshToken(res, { username, email, role });

          logger.info("Tokens upadated");
          //@ts-ignore
          req.userEmail = email;
          //@ts-ignore
          req.userRole = role;
          //@ts-ignore
          req.userName = username;
          return next();
        } else {
          throw error;
        }
      }
    );
  } catch (error: any) {
    res.status(400).json({ name: error.name, message: error.message });
  }
}
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const { accessToken, refreshToken }: CookieType = req.cookies;
    //Verify Access Token
    jwt.verify(
      accessToken,
      PRIVATE_KEY,
      (error: jwt.VerifyErrors | null, decoded) => {
        if (!error) {
          return next();
        } else {
          throw error;
        }
      }
    );
  } catch (error: any) {
    res.json({ isLoggedIn: false });
  }
}
