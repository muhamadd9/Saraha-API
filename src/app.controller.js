import connectDB from "./DB/connection.js";
import authController from "./Modules/auth/auth.controller.js";
import userController from "./Modules/user/user.controller.js";
import messageController from "./Modules/messages/message.controller.js";
import { globalErrorHandler } from "./utils/errorHandling/globalErrorHandlng.js";
import { notFoundHandler } from "./utils/errorHandling/notFoundHandler.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  connectDB();
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);

  app.all("*", notFoundHandler);

  app.use(globalErrorHandler);
};

export default bootstrap;
