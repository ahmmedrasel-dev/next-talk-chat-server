import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as string,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret as string);
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.refresh_token_secret as string, {
    expiresIn: config.refresh_token_expires_in as string,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.refresh_token_secret as string);
};
