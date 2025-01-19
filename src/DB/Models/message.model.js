import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const messageModel = model("Message", messageSchema);
