import { NextFunction, Request, Response } from "express";
import { IRequest } from "../common/interfaces/user.interface";
import { UserModel } from "../DB/models/user.model";
import { UserRepository } from "../DB/repos/user.repo";
import { ApplicationError } from "../utils/response/error.response";
import { decryption } from "../utils/security/encryption.security";
import { verifyToken } from "../utils/security/token.util";
import { JwtPayload } from "jsonwebtoken";
import { BlackListedTokenRepository } from "../DB/repos/black-listed-token.repo";
import { BlackListedTokensModel } from "../DB/models/black-listed-tokens.model";

const userRepository = new UserRepository(UserModel);
const blackListedTokenRepository = new BlackListedTokenRepository(
  BlackListedTokensModel,
);
export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return new ApplicationError("Unauthorized, no token provided", 401);
  }
  const [prefix, token] = authorization.split(" ");
  if (prefix !== process.env.PREFIX) {
    throw new ApplicationError("Unauthorized, invalid token", 401);
  }
  if (!token) {
    throw new ApplicationError("Unauthorized, no token provided", 401);
  }
  const decoded = verifyToken({
    token,
    secret: process.env.JWT_SECRET as string,
  });
  if (!decoded._id) {
    throw new ApplicationError("Unauthorized, invalid token", 401);
  }
  const isTokenBlackListed = await blackListedTokenRepository.findOneDocument({
    tokenId: decoded.jti as string,
  });
  if (isTokenBlackListed) {
    throw new ApplicationError(
      "your session has been expired, please login again",
      401,
    );
  }
  const user = await userRepository.findDocumentById(decoded._id, "-password");
  if (!user) {
    throw new ApplicationError("Unauthorized, user not found", 401);
  }
  user.phoneNumber = decryption({ cipherText: user.phoneNumber as string });

  (req as unknown as IRequest).loggedInUser = {
    user,
    token: decoded as JwtPayload,
  };
  next();
};
