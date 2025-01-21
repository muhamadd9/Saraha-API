import { userModel } from "../../DB/Models/user.model.js";
import { emailEmmiter } from "../../utils/emails/email.event.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import CustomError from "../../utils/errorHandling/customError.js";
import { compareHash, generateHash } from "../../utils/hashing/hash.js";

// get Profile
export const profile = async (req, res, next) => {
  const { user } = req;
  // decrypt phone
  const phone = decrypt({ cipherText: user.phone });

  return res.status(200).json({ success: true, results: { ...user, phone } });
};

// update profile
export const updateProfile = async (req, res, next) => {
  if (req.body.phone) req.body.phone = encrypt({ plainText: req.body.phone });
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (req.body.email) {
    updatedUser.isActivated = false;
    await updatedUser.save();
    emailEmmiter.emit("sendEmail", req.body.email);
  }
  return res.status(200).json({ success: true, results: updatedUser });
};

// change password
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  // compare password with hashed password

  if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
    return next(new CustomError("Password is wrong", 400));

  const newHashedPassword = generateHash({
    plainText: newPassword,
  });

  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { password: newHashedPassword, changedAt: Date.now() },
      { new: true, runValidators: true }
    )
    .select("-password");

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    results: updatedUser,
  });
};

export const deactivateAcccount = async (req, res, next) => {
  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { isDeleted: true },
      { new: true, runValidators: true }
    )
    .select("-password");
  return res.status(200).json({ success: true, results: updatedUser });
};
