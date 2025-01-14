import { userModel } from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import CustomError from "../../utils/errorHandling/customError.js";
import { emailEmmiter } from "../../utils/emails/email.event.js";
import { compareHash, generateHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import { encrypt } from "../../utils/encryption/encryption.js";

export const register = async (req, res, next) => {
  const { email, password, userName, phone, confirmPassword } = req.body;

  // encrypt phone and hash Email
  const user = await userModel.create({
    email,
    password: generateHash({
      plainText: password,
      rounds: Number(process.env.ROUNDS),
    }),
    userName,
    phone: encrypt({ plainText: phone }),
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

  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new CustomError("Password is wrong", 400));

  const token = generateToken({ payload: { id: user._id, email: user.email } });
  jwt.sign(
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
