import { Document } from "mongoose";
import {
  GENDER_ENUM,
  OTP_TYPES_ENUM,
  PROVIDERS_ENUM,
  ROLES_ENUM,
} from "../enums/user.enums";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface IOTP {
  type: OTP_TYPES_ENUM;
  code: string;
  expiresAt: number;
  blockedUntil: number | null;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  phoneNumber?: string;
  DOB?: Date;
  isDeactivated: boolean;
  role: ROLES_ENUM;
  gender: GENDER_ENUM;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
  providers: PROVIDERS_ENUM;
  isPublic: boolean;
  googleId?: string;
  OTPS?: IOTP[];
}

export interface IRequest extends Request {
  loggedInUser: {
    user: IUser;
    token: JwtPayload;
  };
}
