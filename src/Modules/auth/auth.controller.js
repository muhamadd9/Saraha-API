import { Router } from "express";
import * as userService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(userService.register));
router.post("/login", asyncHandler(userService.login));
router.get(
  "/acctivate_account/:token",
  asyncHandler(userService.acctivateAccount)
);

export default router;
