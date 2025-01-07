import jwt from "jsonwebtoken";
import { userModel } from "../DB/Models/user.model.js";
const isAuthenticaded = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // check if it is bearer
    if (!authorization || !authorization.startsWith("Bearer"))
      return res
        .status(403)
        .json({ success: false, message: "Token required" });

    const token = authorization.split(" ")[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(id).select("-password").lean();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default isAuthenticaded;

