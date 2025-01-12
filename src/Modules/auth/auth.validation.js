import Joi from "joi";
import { genders } from "../../DB/Models/user.model.js";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  userName: Joi.string().max(15).min(5).required(),
  phone: Joi.string().required(),
  gender: Joi.string().valid(...Object.values(genders)),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
