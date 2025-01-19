import { Router } from "express";
import * as messageService from "./message.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import isAuthenticaded from "../../middleware/auth.middleware.js";
import isAuthorized from "../../middleware/authoization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as messageSchema from "./message.validation.js";
import { roles } from "../../DB/Models/user.model.js";

const router = Router();

// create message
router.post(
  "/",
  isAuthenticaded,
  isAuthorized(roles.user),
  validation(messageSchema.sendMessage),
  asyncHandler(messageService.createMessage)
);

// get Single Message
router.get(
  "/:id",
  isAuthenticaded,
  isAuthorized(roles.user, roles.admin),
  validation(messageSchema.getMessage),
  asyncHandler(messageService.getSignleMessage)
);

// get all messages
router.get(
  "/",
  isAuthenticaded,
  isAuthorized(roles.user),
  validation(messageSchema.getAllMessages),
  asyncHandler(messageService.getAllMessages)
);

// update
router.patch("/", asyncHandler(messageService.updateMessage));

// delete
router.patch("/", asyncHandler(messageService.deleteMessage));

export default router;
