import type { Request, Response } from "express";

export interface IError extends Error {
  statusCode?: number;
}

export class ApplicationError extends Error implements IError {
  constructor(
    message: string,
    public statusCode: number,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string, cause?: unknown) {
    super(message, 404, cause);
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message: string, cause?: unknown) {
    super(message, 400, cause);
  }
}

export const errorHandler = (
  err: ApplicationError,
  req: Request,
  res: Response,
): Response => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: "Internal server error",
    error: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
