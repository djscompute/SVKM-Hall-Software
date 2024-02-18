import { Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { jwtPayload, jwtPayloadToken } from "../types/jwtPayload";

//signAccessToken fnc
export function signAccessToken(res: Response, payload: jwtPayload) {
  const PRIVATE_KEY = config.get<string>("PRIVATE_KEY");
  const token = jwt.sign({ ...payload }, PRIVATE_KEY, { expiresIn: "300s" });
  res.cookie("accessToken", token, {
    httpOnly: true,
    // maxAge: 20000, //20 sec
    // maxAge: 3600000, // 1 hr
    maxAge: 172800000, // 2days
  });
}

//signRefreshToken fnc
export function signRefreshToken(res: Response, payload: jwtPayload): string {
  const PRIVATE_REFRESH_KEY = config.get<string>("PRIVATE_REFRESH_KEY");
  const token = jwt.sign({ ...payload }, PRIVATE_REFRESH_KEY, {
    expiresIn: "1y",
  });
  res.cookie("refreshToken", token, {
    httpOnly: true,
    maxAge: 172800000, // 2days
    // secure: true,
  });
  return token;
}

// expiresIn: "1y"
