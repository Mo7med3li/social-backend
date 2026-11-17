import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  secret = process.env.USER_JWT_SECRET,
  options = {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION_TIME),
  },
}: {
  payload?: Record<string, unknown>;
  secret?: string;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, secret as string, options);
};

export const verifyToken = ({
  token,
  secret = process.env.USER_JWT_SECRET,
}: {
  token: string;
  secret?: string;
}) => {
  return jwt.verify(token, secret as string) as JwtPayload;
};
