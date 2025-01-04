import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    match: /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
});

export const userModel = model("User", userSchema);
