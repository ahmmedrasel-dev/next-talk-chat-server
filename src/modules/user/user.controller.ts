import { Request, Response } from "express";
import { createUser, findUserByPhone, validatePassword } from "./user.service";
import { generateToken, generateRefreshToken } from "../../utils/jwt";
import { signupSchema, loginSchema } from "./user.validation";
import SendResponse from "../../utils/sendResponse";

export const signup = async (req: Request, res: Response) => {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return SendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Validation failed",
        data: parseResult.error.errors,
      });
    }
    const { full_name, password, phone } = parseResult.data;

    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      return SendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Phone number already exists.",
        data: null,
      });
    }
    const user = await createUser({ full_name, phone, password });
    return SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        full_name: user.full_name,
        phone: user.phone,
      },
    });
  } catch (error) {
    return SendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Signup failed",
      data: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return SendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Validation failed",
        data: parseResult.error.errors,
      });
    }
    const { phone, password } = parseResult.data;
    const user = await findUserByPhone(phone);
    if (!user) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid credentials.",
        data: null,
      });
    }
    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid credentials.",
        data: null,
      });
    }
    const token = generateToken({ _id: user._id, phone: user.phone });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      phone: user.phone,
    });
    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: { token, refreshToken },
    });
  } catch (error) {
    return SendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Login failed",
      data: error,
    });
  }
};
