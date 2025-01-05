import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already taken"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already taken"],
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number is already taken"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

export const userModel = model("User", userSchema);
