import { messageModel } from "../../DB/Models/message.model.js";
import { userModel } from "../../DB/Models/user.model.js";
import CustomError from "../../utils/errorHandling/customError.js";
import { flags } from "./message.validation.js";

// create message
export const createMessage = async (req, res, next) => {
  const { content, reciver } = req.body;
  const user = await userModel.findById(reciver);
  if (!user) return next(new CustomError("Reciver not found", 404));

  messageModel.create({ reciver, content, sender: req.user._id });
  return res
    .status(200)
    .json({ success: true, message: "Message sent successfully" });
};

// get Single Message
export const getSignleMessage = async (req, res, next) => {
  const message = await messageModel.findById(req.params.id).populate([
    { path: "sender", select: "userName email -_id" },
    { path: "reciver", select: "userName email -_id" },
  ]);
  if (!message) return next(new CustomError("Message not found", 404));
  // current user is not sender or reciver
  if (
    message.reciver?.email != req.user.email &&
    message.sender?.email != req.user.email
  )
    return next(new CustomError("Not authourized!", 401));
  return res.status(200).json({ success: true, message });
};

// get all messages
export const getAllMessages = async (req, res, next) => {
  const flag = req.query;
  let results;
  if (flag == flags.inbox) {
    results = await messageModel.find({ reciver: req.user._id });
  } else {
    results = await messageModel.find({ sender: req.user._id });
  }

  return res.status(200).json({ success: true, results });
};

// update
export const updateMessage = async (req, res, next) => {
  const message = await messageModel.findById(req.params.id);
  if (!message) return next(new CustomError("Message not found", 404));
  // current user is not sender
  if (message.sender.toString() != req.user._id.toString())
    return next(new CustomError("Not authourized!", 401));

  const updatedMessage = await messageModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  return res.status(200).json({ success: true, message: updatedMessage });
};

// delete
export const deleteMessage = async (req, res, next) => {
  const message = await messageModel.findById(req.params.id);
  if (!message) return next(new CustomError("Message not found", 404));

  // current user is not sender or reciver
  if (
    message.reciver.toString() != req.user._id.toString() &&
    message.sender.toString() != req.user._id.toString()
  )
    return next(new CustomError("Not authourized!", 401));

  await messageModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: "Message deleted" });
};
