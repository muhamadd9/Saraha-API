import CryptoJS from "crypto-js";

export const profile = async (req, res, next) => {
  const { user } = req;
  // decrypt phone
  const phone = CryptoJS.AES.decrypt(
    user.phone,
    process.env.SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  return res.status(200).json({ success: true, results: { ...user, phone } });
};
