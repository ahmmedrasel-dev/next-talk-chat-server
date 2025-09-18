import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema<IUser>({
  full_name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IUser & Document>("User", UserSchema);
