import { Router } from "express";
import authenticationService from "./services/auth.service";

export const authRouter = Router();

authRouter.post("/register", authenticationService.register);
