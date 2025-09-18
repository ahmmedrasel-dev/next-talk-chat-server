import jwt from "jsonwebtoken";
import config from "../config";

const JWT_SECRET = config.jwt_secret || "your_super_secret_key";
const REFRESH_TOKEN_SECRET =
  config.jwt_secret + "_refresh" || "your_super_refresh_secret_key";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
