import connectDB from "./DB/connection.js";
import authController from "./Modules/auth/auth.controller.js";
import userController from "./Modules/user/user.controller.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  connectDB();
  app.use("/auth", authController);
  app.use("/user", userController);

  app.all("*", (req, res) => {
    return res.status(404).json({ message: "Page Not Found" });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    return res
      .status(status)
      .json({ success: false, message: err.message, stack: err.stack });
  });
};

export default bootstrap;
