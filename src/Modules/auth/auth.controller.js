import { Router } from "express";
import * as userService from "./auth.service.js";

const router = Router();

router.post("/register", userService.register);
router.post("/login", userService.login);
router.get("/acctivate_account/:token", userService.acctivateAccount);

export default router;
