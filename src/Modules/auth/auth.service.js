import { userModel } from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

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
