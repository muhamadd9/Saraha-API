import { Router } from "express";
import * as userService from "./auth.service.js";

const router = Router();

router.post("/register", userService.register);
router.post("/login", userService.login);

export default router;
