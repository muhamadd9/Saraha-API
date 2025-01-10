import jwt from "jsonwebtoken";
import { userModel } from "../DB/Models/user.model.js";
const isAuthenticaded = async (req, res, next) => {
  const { authorization } = req.headers;
  // check if it is bearer
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new Error("Token required", { cause: 403 }));

  const token = authorization.split(" ")[1];

  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findById(id).select("-password").lean();

  if (!user) return next(new Error("User not found", { cause: 404 }));

  req.user = user;
  return next();
};

export default isAuthenticaded;
