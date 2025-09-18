import User from "./user.model";
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

// Add contact by phone (search and add in one call)
export const addContact = async (req: Request, res: Response) => {
  // Requires JWT middleware to set req.userId
  try {
    const { contactPhone } = req.body;

    // Search for contact by phone
    const contactUser = await User.findOne({ phone: contactPhone });
    if (!contactUser) {
      return SendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Contact not found.",
        data: null,
      });
    }
    // Find current user by userId from JWT middleware
    const userId = (req as any).userId;
    if (!userId) {
      return SendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized. Missing userId.",
        data: null,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return SendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found.",
        data: null,
      });
    }
    // Initialize contacts array if missing
    if (!user.contacts) user.contacts = [];
    // Check if contact already added
    if (
      user.contacts
        .map((id) => id.toString())
        .includes(contactUser._id.toString())
    ) {
      return SendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Contact already added.",
        data: null,
      });
    }
    // Add contact
    user.contacts.push(contactUser._id);
    await user.save();
    return SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Contact found and added successfully.",
      data: {
        _id: contactUser._id,
        full_name: contactUser.full_name,
        phone: contactUser.phone,
      },
    });
  } catch (error) {
    return SendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to add contact.",
      data: error,
    });
  }
};
