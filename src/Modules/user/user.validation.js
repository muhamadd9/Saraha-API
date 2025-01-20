import Joi from "joi";

export const updateProfileSchema = Joi.object({
  email: Joi.string().email(),
  userName: Joi.string().max(15).min(5),
  phone: Joi.string(),
}).required();

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().not(Joi.ref("oldPassword")).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
}).required();
