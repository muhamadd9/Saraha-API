import jwt from "jsonwebtoken";
import { userModel } from "../../DB/Models/user.model.js";
import CryptoJS from "crypto-js";

export const profile = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await userModel.findById(id).select("-password").lean();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    // decrypt phone
    const phone = CryptoJS.AES.decrypt(
      user.phone,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    return res.status(200).json({ success: true, results: { ...user, phone } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
