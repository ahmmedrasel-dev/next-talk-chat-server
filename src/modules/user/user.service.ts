import User from "./user.model";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwt";

export const createUser = async (payload: IUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = new User({
    full_name: payload.full_name,
    phone: payload.phone,
    password: hashedPassword,
  });
  return user.save();
};

export const findUserByPhone = async (phone: string) => {
  return User.findOne({ phone });
};

export const validatePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export const loginUser = async (phone: string, password: string) => {
  const user = await findUserByPhone(phone);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await validatePassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken({ _id: user._id, phone: user.phone });
  const refreshToken = generateRefreshToken({
    _id: user._id,
    phone: user.phone,
  });

  return {
    user: {
      _id: user._id,
      full_name: user.full_name,
      phone: user.phone,
    },
    accessToken,
    refreshToken,
  };
};

export const addContactToUser = async (
  userId: string,
  contactPhone: string
) => {
  // Search for contact by phone
  const contactUser = await User.findOne({ phone: contactPhone });
  if (!contactUser) {
    throw new Error("Contact not found");
  }

  // Find current user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Initialize contacts array if missing
  if (!user.contacts) user.contacts = [];

  // Check if contact already added
  if (
    user.contacts
      .map((id) => id.toString())
      .includes(contactUser._id.toString())
  ) {
    throw new Error("Contact already added");
  }

  // Add contact
  user.contacts.push(contactUser._id);
  await user.save();

  return {
    _id: contactUser._id,
    full_name: contactUser.full_name,
    phone: contactUser.phone,
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("contacts", "full_name phone");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyToken(refreshToken) as any;
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }

    const newToken = generateToken({ _id: user._id, phone: user.phone });
    const newRefreshToken = generateRefreshToken({
      _id: user._id,
      phone: user.phone,
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        _id: user._id,
        full_name: user.full_name,
        phone: user.phone,
      },
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
