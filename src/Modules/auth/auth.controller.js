import { Router } from "express";
import * as userService from "./auth.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as authSchemas from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validation(authSchemas.registerSchema),
  asyncHandler(userService.register)
);
router.post(
  "/login",
  validation(authSchemas.loginSchema),
  asyncHandler(userService.login)
);
router.get(
  "/acctivate_account/:token",
  asyncHandler(userService.acctivateAccount)
);

export default router;
