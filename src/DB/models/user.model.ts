import { model, Schema } from "mongoose";
import {
  GENDER_ENUM,
  OTP_TYPES_ENUM,
  PROVIDERS_ENUM,
  ROLES_ENUM,
} from "../../common/enums/user.enums";
import { IUser } from "../../common/interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
        name: "idx_email",
      },
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    phoneNumber: String,
    DOB: Date,
    isDeactivated: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ROLES_ENUM,
      default: ROLES_ENUM.USER,
    },
    gender: {
      type: String,
      enum: GENDER_ENUM,
      default: GENDER_ENUM.MALE,
    },
    profilePicture: String,
    coverPicture: String,
    bio: String,
    providers: {
      type: String,
      enum: PROVIDERS_ENUM,
      default: PROVIDERS_ENUM.LOCAL,
    },
    isPublic: { type: Boolean, default: false },
    googleId: String,
    OTPS: [
      {
        type: { type: String, enum: OTP_TYPES_ENUM, required: true },
        code: {
          type: String,
          required: true,
          minlength: [6, "OTP code must be 6 characters long"],
        },
        expiresAt: { type: Date, default: Date.now() + 300000 }, // 5 minutes
        blockedUntil: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true },
);

export const UserModel = model<IUser>("User", userSchema);
