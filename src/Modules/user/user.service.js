import CryptoJS from "crypto-js";
import { userModel } from "../../DB/Models/user.model.js";

export const profile = async (req, res) => {
  try {
    const { user } = req;
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
