// this is what jwt.sign generates
export type jwtPayloadToken = {
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

// this is what jwt.sign requires
export type jwtPayload = Pick<jwtPayloadToken, "email" | "username" | "role">;
