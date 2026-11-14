import { Router } from "express";
import authenticationService from "./services/auth.service";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/signup", authenticationService.register);
authRouter.patch("/confirm-email", authenticationService.confirmEmail);
authRouter.patch(
  "/resend-email-otp-confirmation",
  authenticationService.resendEmailOtpConfirmation,
);
authRouter.post("/login", authenticationService.login);
authRouter.post("/logout", authMiddleware, authenticationService.logout);
authRouter.post("/forgot-password-otp", authenticationService.forgotPassword);
authRouter.patch("/password-reset", authenticationService.PasswordReset);
