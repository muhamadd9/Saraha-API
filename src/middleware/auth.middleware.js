import { userModel } from "../DB/Models/user.model.js";
import CustomError from "../utils/errorHandling/customError.js";
import { verifyToken } from "../utils/token/token.js";
const isAuthenticaded = async (req, res, next) => {
  const { authorization } = req.headers;
  // check if it is bearer
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new CustomError("Token required", 403));

  const token = authorization.split(" ")[1];

  const { id } = verifyToken({ token });
  const user = await userModel.findById(id).select("-password").lean();

  if (!user) return next(new CustomError("User not found", 404));

  req.user = user;
  return next();
};

export default isAuthenticaded;
