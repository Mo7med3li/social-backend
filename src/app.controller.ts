import express from "express";
import cors from "cors";
import * as controllers from "./modules/index";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { resolve } from "node:path";
import { errorHandler } from "./utils/api.utils";

config({ path: resolve("config/.env") });

// variables
const port = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2000,
  message: "Too many requests, please try again later.",
});

export const bootstrap = () => {
  // initialize express app
  const app = express();

  //third party middlewares
  app.use(cors(), helmet(), express.json(), limiter);

  // landing route
  app.get("/", (req, res) => {
    res.status(200).json({
      message: `Welcome to ${process.env.APPLICATION_NAME} API`,
    });
  });

  // routes
  app.use("/api/auth", controllers.authRouter);
  app.use("/api/users", controllers.usersRouter);
  app.use("/api/posts", controllers.postsRouter);
  app.use("/api/comments", controllers.commentsRouter);
  app.use("/api/reacts", controllers.reactsRouter);

  //   all other routes
  app.all("{/*dummy}", (req, res) => {
    res
      .status(404)
      .json({ message: "route not found , please check the documentation" });
  });

  // error handling
  app.use(errorHandler);

  // start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
