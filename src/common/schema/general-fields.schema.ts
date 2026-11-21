import z from "zod";
import { GENDER_ENUM } from "../enums/user.enums";

export const generalFieldsSchema = {
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name must be at least 3 characters long")
    .max(20, "First name must be less than 50 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name must be at least 3 characters long")
    .max(20, "Last name must be less than 50 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  gender: z.enum(GENDER_ENUM),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(11, "Phone number must be at least 11 characters long")
    .max(11, "Phone number must be less than 11 characters long"),
  DOB: z.string().min(1, "Date of birth is required"),
  confirmPassword: z
    .string()
    .min(1, "Confirm password is required")
    .min(8, "Confirm password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Confirm password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  otp: z
    .string()
    .min(1, "OTP is required")
    .min(6, "OTP must be 6 characters long"),
};
