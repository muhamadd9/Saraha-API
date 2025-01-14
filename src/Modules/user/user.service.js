import { decrypt } from "../../utils/encryption/encryption.js";
export const profile = async (req, res, next) => {
  const { user } = req;
  // decrypt phone
  const phone = decrypt({ cipherText: user.phone });

  return res.status(200).json({ success: true, results: { ...user, phone } });
};
