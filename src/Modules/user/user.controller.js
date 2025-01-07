import { Router } from "express";
import * as userService from "./user.service.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/profile", isAuthenticaded, userService.profile);

export default router;
