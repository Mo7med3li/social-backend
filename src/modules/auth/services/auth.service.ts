import type { Request, Response } from "express";

class AuthenticationService {
  constructor() {}

  register = (req: Request, res: Response): Response => {
    return res.status(201).json({
      message: "User registered successfully",
    });
  };
}

export default new AuthenticationService();
