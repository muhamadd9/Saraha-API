import { Router } from "express";
import * as userService from "./user.service.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import isAuthorized from "../../middleware/authoization.middleware.js";
import { roles } from "../../DB/Models/user.model.js";

const router = Router();

router.get(
  "/profile",
  asyncHandler(isAuthenticaded),
  isAuthorized(roles.user),
  asyncHandler(userService.profile)
);

export default router;
