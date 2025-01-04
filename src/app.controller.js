import connectDB from "./DB/connection.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  connectDB();

  app.all("*", (req, res) => {
    return res.status(404).json({ message: "Page Not Found" });
  });
};

export default bootstrap;
