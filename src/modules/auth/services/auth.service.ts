import type { Request, Response } from "express";
import { UserRepository } from "../../../DB/repos/user.repo";
import { UserModel } from "../../../DB/models/user.model";
import { IRequest, IUser } from "../../../common/interfaces/user.interface";
import {
  ApplicationError,
  BadRequestError,
  NotFoundError,
} from "../../../utils/response/error.response";
import {
  compareHash,
  generateHash,
} from "../../../utils/security/hashing.security";
import {
  decryption,
  encryption,
} from "../../../utils/security/encryption.security";
import { OTP_TYPES_ENUM } from "../../../common/enums/user.enums";
import {
  sendConfirmEmail,
  sendForgotPasswordEmail,
} from "../../../utils/email/send-otp";
import { generateToken } from "../../../utils/security/token.util";
import { randomUUID } from "crypto";
import { BlackListedTokensModel } from "../../../DB/models/black-listed-tokens.model";
import { BlackListedTokenRepository } from "../../../DB/repos/black-listed-token.repo";

class AuthenticationService {
  private userRepo = new UserRepository(UserModel);
  private blackListedTokenRepository = new BlackListedTokenRepository(
    BlackListedTokensModel,
  );

  // register user
  register = async (req: Request, res: Response): Promise<Response> => {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      phoneNumber,
      DOB,
    }: Partial<IUser> = req.body;

    if (!firstName || !lastName || !email || !password || !gender) {
      throw new BadRequestError("Missing required registration fields");
    }

    const isUserExist = await this.userRepo.findOneDocument({ email }, "email");
    if (isUserExist) {
      throw new ApplicationError("User already exists", 400);
    }
    const hashedPassword = generateHash({ plainText: password as string });
    const encryptedPhoneNumber = encryption({
      plainText: phoneNumber as string,
    });

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await sendConfirmEmail({
        to: email,
        subject: "Confirmation Email",
        otp: otpValue,
        userName: firstName,
      });
    } catch {
      throw new ApplicationError(
        "User created but failed to send confirmation email. Please resend OTP.",
        502,
      );
    }

    const otp = {
      code: generateHash({ plainText: otpValue }),
      expiresAt: Date.now() + 300000, // 5 minutes
      type: OTP_TYPES_ENUM.CONFIRMATION,
      blockedUntil: Date.now() + 60000, // 1 minute
    };

    const newUser = await this.userRepo.createNewDocument({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      OTPS: [otp],
      phoneNumber: encryptedPhoneNumber,
      DOB: DOB as Date,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  };

  // confirm email
  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: { email: string; otp: string } = req.body;
    const user = await this.userRepo.findOneDocument({
      email,
      isVerified: false,
    });
    if (!user) {
      throw new NotFoundError("User not found or already verified", 404);
    }
    const isOtpValid = user.OTPS?.some(
      (otpItem) =>
        otpItem.type === OTP_TYPES_ENUM.CONFIRMATION &&
        compareHash({ plainText: otp, hash: otpItem.code }) &&
        otpItem.expiresAt > Date.now(),
    );
    if (!isOtpValid) {
      throw new BadRequestError("Invalid OTP or OTP expired");
    }
    await this.userRepo.updateOneDocument(
      { email },
      {
        $set: { isVerified: true },
        $pull: { OTPS: { type: OTP_TYPES_ENUM.CONFIRMATION } },
      },
    );
    return res.status(200).json({ message: "Email confirmed successfully" });
  };

  // resend email — arrow so Express keeps `this` (class instance)
  resendEmailOtpConfirmation = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { email }: { email: string } = req.body;

    const user = await this.userRepo.findOneDocument({
      email,
      isVerified: false,
    });
    if (!user) {
      throw new NotFoundError("User not found or already verified", 404);
    }
    const userEmailOtp = user.OTPS?.find(
      (otpItem) => otpItem.type === OTP_TYPES_ENUM.CONFIRMATION,
    )!;
    if (userEmailOtp?.blockedUntil! > Date.now()) {
      throw new BadRequestError(
        `OTP is blocked, please try again later try after ${Math.ceil((userEmailOtp.blockedUntil! - Date.now()) / 1000)} seconds`,
      );
    }

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await sendConfirmEmail({
        to: email,
        subject: "Confirmation Email",
        otp: otpValue,
        userName: user.firstName,
      });
      const newOtp = {
        code: generateHash({ plainText: otpValue }),
        expiresAt: Date.now() + 300000, // 5 minutes
        type: OTP_TYPES_ENUM.CONFIRMATION,
        blockedUntil: Date.now() + 60000, // 1 minute
      };

      await this.userRepo.updateOneDocument({ email }, { OTPS: [newOtp] });
    } catch {
      throw new ApplicationError(
        "Failed to send confirmation email. Please try again later.",
        502,
      );
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  };

  // login user
  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await this.userRepo.findOneDocument(
      {
        email,
      },

      "-OTPS",
    );
    if (!user) {
      throw new ApplicationError("invalid email or password", 400);
    }
    if (!user.isVerified) {
      throw new ApplicationError(
        "email not verified , please verify your email",
        400,
      );
    }
    if (user.isDeactivated) {
      throw new ApplicationError(
        "account is deactivated, please contact admin to activate your account",
        400,
      );
    }
    const isPasswordValid = compareHash({
      plainText: password,
      hash: user.password,
    });
    if (!isPasswordValid) {
      throw new ApplicationError("invalid email or password", 400);
    }
    const { password: _, ...userData } = user.toObject();
    const jwtid = randomUUID();
    const accessToken = generateToken({
      payload: { _id: user._id, role: user.role },
      secret: process.env.USER_JWT_SECRET as string,
      options: {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
        jwtid,
      },
    });

    const refreshToken = generateToken({
      payload: { _id: user._id, role: user.role },
      secret: process.env.USER_REFRESH_JWT_SECRET as string,
      options: {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
        jwtid,
      },
    });
    userData.phoneNumber = decryption({
      cipherText: user.phoneNumber as string,
    });

    return res.status(200).json({
      message: "Login successful",
      user: userData,
      accessToken,
      refreshToken,
    });
  };

  // logout user
  logout = async (req: Request, res: Response) => {
    const {
      token: { exp, jti },
    } = (req as unknown as IRequest).loggedInUser;
    const blackListedToken =
      await this.blackListedTokenRepository.createNewDocument({
        tokenId: jti!,
        expiresAt: new Date(exp || Date.now() + 60000),
      });

    return res.json({
      message: "logged out successfully",
      data: blackListedToken,
    });
  };

  // forgot password
  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email }: { email: string } = req.body;
    const user = await this.userRepo.findOneDocument({ email });
    if (!user) {
      throw new NotFoundError("User not found", 404);
    }
    const userEmailOtp = user.OTPS?.find(
      (otpItem) => otpItem.type === OTP_TYPES_ENUM.PASSWORD_RESET,
    )!;
    if (userEmailOtp?.blockedUntil! > Date.now()) {
      throw new BadRequestError(
        `OTP is blocked, please try again later try after ${Math.ceil((userEmailOtp.blockedUntil! - Date.now()) / 1000)} seconds`,
      );
    }

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await sendForgotPasswordEmail({
        to: email,
        subject: "Forgot Password",
        otp: otpValue,
        userName: user.firstName,
      });
      const newOtp = {
        code: generateHash({ plainText: otpValue }),
        expiresAt: Date.now() + 300000, // 5 minutes
        type: OTP_TYPES_ENUM.PASSWORD_RESET,
        blockedUntil: Date.now() + 60000, // 1 minute
      };
      await this.userRepo.updateOneDocument({ email }, { OTPS: [newOtp] });
    } catch {
      throw new ApplicationError("Failed to send forgot password email", 502);
    }
    return res
      .status(200)
      .json({ message: "Forgot password email sent successfully" });
  };

  // confirm password reset otp
  PasswordReset = async (req: Request, res: Response): Promise<Response> => {
    const {
      email,
      newPassword,
      confirmPassword,
      otp,
    }: {
      email: string;
      newPassword: string;
      confirmPassword: string;
      otp: string;
    } = req.body;
    const user = await this.userRepo.findOneDocument({ email });
    if (!user) {
      throw new NotFoundError("User not found", 404);
    }
    const userEmailOtp = user.OTPS?.find(
      (otpItem) => otpItem.type === OTP_TYPES_ENUM.PASSWORD_RESET,
    )!;
    if (!userEmailOtp) {
      throw new BadRequestError("Invalid OTP, please generate new OTP");
    }

    if (userEmailOtp.expiresAt! < Date.now()) {
      throw new BadRequestError("OTP expired , please generate new OTP");
    }
    if (!compareHash({ plainText: otp, hash: userEmailOtp.code })) {
      throw new BadRequestError("Invalid OTP , please generate new OTP");
    }
    const hashedNewPassword = generateHash({ plainText: newPassword });
    await this.userRepo.updateOneDocument(
      { email },
      {
        $set: { password: hashedNewPassword },
        $pull: { OTPS: { type: OTP_TYPES_ENUM.PASSWORD_RESET } },
      },
    );
    return res
      .status(200)
      .json({ message: "Forgot password OTP confirmed successfully" });
  };
}

export default new AuthenticationService();
