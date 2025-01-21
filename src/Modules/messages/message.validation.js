import Joi from "joi";
import { isObjectId } from "../../middleware/validation.middleware.js";

export const flags = {
  inbox: "inbox",
  outbox: "outbox",
};

export const sendMessage = Joi.object({
  content: Joi.string().required(),
  reciver: Joi.custom(isObjectId).required(),
}).required();

export const getMessage = Joi.object({
  id: Joi.custom(isObjectId).required(),
}).required();

export const getAllMessages = Joi.object({
  flag: Joi.string()
    .valid(...Object.values(flags))
    .required(),
}).required();

export const updateMessage = Joi.object({
  id: Joi.custom(isObjectId).required(),
  content: Joi.string(),
});

export const deleteMessage = Joi.object({
  id: Joi.custom(isObjectId).required(),
});
