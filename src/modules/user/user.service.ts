import User from "./user.model";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

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
