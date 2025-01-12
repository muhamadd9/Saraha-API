import { genders, userModel } from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import sendEmails, { subjects } from "../../utils/sendEmails.js";
import { signUp } from "../../utils/generateHTML.js";
import CustomError from "../../utils/customError.js";
import { emailEmmiter } from "../../utils/email.event.js";
import Joi from "joi";

export const register = async (req, res, next) => {
  const { email, password, userName, phone, confirmPassword } = req.body;

  // encrypt phone and hash Email
  const user = await userModel.create({
    email,
    password: bcrypt.hashSync(password, Number(process.env.ROUND)),
    userName,
    phone: CryptoJS.AES.encrypt(phone, process.env.SECRET_KEY),
  });

  // email
  emailEmmiter.emit("sendEmail", email);
  return res.status(201).json({ success: true, user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new CustomError("Email not valid", 400));

  if (!user.isActivated)
    return next(new CustomError("Acctivate your account first", 400));

  const match = bcrypt.compareSync(password, user.password);

  if (!match) return next(new CustomError("Password is wrong", 400));

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
    // { expiresIn: "40s" }
  );
  return res
    .status(200)
    .json({ success: true, message: "Login Success", token });
};

export const acctivateAccount = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new CustomError("Token required", 403));

  const { email } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email });
  if (!user) return next(new CustomError("User not found", 404));
  user.isActivated = true;
  await user.save();
  return res.status(200).json({ success: true, message: "Try to login" });
};
