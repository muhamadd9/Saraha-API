import { Router } from "express";
import * as userService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validation(registerSchema), asyncHandler(userService.register));
router.post("/login", asyncHandler(userService.login));
router.get(
  "/acctivate_account/:token",
  asyncHandler(userService.acctivateAccount)
);

export default router;
