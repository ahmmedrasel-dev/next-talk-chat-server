import { Request, Response } from "express";
import {
  createUser,
  findUserByPhone,
  loginUser,
  addContactToUser,
  getUserById,
  refreshAccessToken,
} from "./user.service";
import { signupSchema, loginSchema } from "./user.validation";
import SendResponse from "../../utils/sendResponse";
import config from "../../config";

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
    const result = await loginUser(phone, password);

    // Set refresh token in another HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      secure: config.node_env === "production",
      httpOnly: true,
    });

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        message: "Authentication tokens set in cookies",
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Invalid credentials" ? 401 : 500;
    return SendResponse(res, {
      statusCode,
      success: false,
      message: error.message || "Login failed",
      data: null,
    });
  }
};

// Add contact by phone (search and add in one call)
export const addContact = async (req: Request, res: Response) => {
  try {
    const { contactPhone } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized. Missing userId.",
        data: null,
      });
    }

    const contactData = await addContactToUser(userId, contactPhone);

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Contact found and added successfully.",
      data: contactData,
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.message === "Contact not found") statusCode = 404;
    if (error.message === "User not found") statusCode = 404;
    if (error.message === "Contact already added") statusCode = 409;

    return SendResponse(res, {
      statusCode,
      success: false,
      message: error.message || "Failed to add contact.",
      data: null,
    });
  }
};

export const authUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized. Missing userId.",
        data: null,
      });
    }

    const user = await getUserById(userId);

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User authenticated successfully.",
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    return SendResponse(res, {
      statusCode,
      success: false,
      message: error.message || "Failed to authenticate user.",
      data: null,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the authentication cookies
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error: any) {
    return SendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to logout",
      data: null,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    if (!refreshTokenFromCookie) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Refresh token not found",
        data: null,
      });
    }

    const result = await refreshAccessToken(refreshTokenFromCookie);

    // Set new tokens in cookies
    res.cookie("authToken", result.token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.cookie("refreshToken", result.refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        user: result.user,
        message: "New authentication tokens set in cookies",
      },
    });
  } catch (error: any) {
    return SendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message || "Failed to refresh token",
      data: null,
    });
  }
};
