import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    // @ts-ignore
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;
