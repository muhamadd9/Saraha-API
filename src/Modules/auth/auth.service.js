import { userModel } from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import sendEmails, { subjects } from "../../utils/sendEmails.js";
import { signUp } from "../../utils/generateHTML.js";

export const register = async (req, res) => {
  try {
    const { email, password, userName, phone, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords must match!" });
    // encrypt phone and hash Email
    const user = await userModel.create({
      email,
      password: bcrypt.hashSync(password, Number(process.env.ROUND)),
      userName,
      phone: CryptoJS.AES.encrypt(phone, process.env.SECRET_KEY),
    });

    // email
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    const link = `http://localhost:3000/auth/acctivate_account/${token}`;
    const emailIsSent = await sendEmails({
      to: email,
      subject: subjects.register,
      html: signUp(link),
    });
    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email not valid" });
    if (!user.isActivated)
      return res
        .status(400)
        .json({ success: false, message: "Acctivate your account first" });
    const match = bcrypt.compareSync(password, user.password);

    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Password is wrong" });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
      // { expiresIn: "40s" }
    );
    return res
      .status(200)
      .json({ success: true, message: "Login Success", token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const acctivateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token)
      return res
        .status(403)
        .json({ success: false, message: "Token required" });

    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email);
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.isActivated = true;
    await user.save();
    return res.status(200).json({ success: true, message: "Try to login" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
