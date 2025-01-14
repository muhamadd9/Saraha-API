import { userModel } from "../../DB/Models/user.model.js";
import jwt from "jsonwebtoken";
import CustomError from "../../utils/errorHandling/customError.js";
import { emailEmmiter } from "../../utils/emails/email.event.js";
import { compareHash, generateHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import { encrypt } from "../../utils/encryption/encryption.js";

export const register = async (req, res, next) => {
  const { email, password, userName, phone } = req.body;

  // create new user
  const user = await userModel.create({
    email,
    // hash password
    password: generateHash({
      plainText: password,
      rounds: Number(process.env.ROUNDS),
    }),
    userName,
    // encrypt phone
    phone: encrypt({ plainText: phone }),
  });

  // email event
  emailEmmiter.emit("sendEmail", email);
  return res.status(201).json({ success: true, user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // find user
  const user = await userModel.findOne({ email });
  // user not found
  if (!user) return next(new CustomError("Email not valid", 400));

  // user not activated
  if (!user.isActivated)
    return next(new CustomError("Acctivate your account first", 400));

  // compare password with hashed password
  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new CustomError("Password is wrong", 400));

  // generate token
  const token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "2h" },
  });

  return res
    .status(200)
    .json({ success: true, message: "Login Success", token });
};

export const acctivateAccount = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new CustomError("Token required", 403));

  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  // find user by email
  const user = await userModel.findOne({ email });
  if (!user) return next(new CustomError("User not found", 404));
  user.isActivated = true;
  await user.save();
  return res.status(200).json({ success: true, message: "Try to login" });
};
