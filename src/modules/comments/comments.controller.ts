import { Router } from "express";

export const commentsRouter = Router();

commentsRouter.get("/", (req, res) => {
  res.send("Hello Comments");
});
