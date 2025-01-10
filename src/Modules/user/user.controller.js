import { Router } from "express";
import * as userService from "./user.service.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.get("/profile", asyncHandler(isAuthenticaded), asyncHandler(userService.profile));

export default router;
