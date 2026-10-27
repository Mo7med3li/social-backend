import { Router } from "express";

export const reactsRouter = Router();

reactsRouter.get("/", (req, res) => {
  res.send("Hello Reacts");
});
