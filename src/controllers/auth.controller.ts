import { type Request, type Response } from "express";
import type { SignUpInput, SignInInput } from "../schemas/auth.schema.js";
import signUpService from "../services/auth-service/sign-up.service.js";
import signInService from "../services/auth-service/sign-in.service.js";
import { env } from "../config/env.js";

const signUp = async (req: Request<{}, {}, SignUpInput>, res: Response) => {
  const { accessToken, user } = await signUpService(req.body);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    })
    .status(201)
    .json({
      success: true,
      data: user,
    });
};

const signIn = async (req: Request<{}, {}, SignInInput>, res: Response) => {
  const { accessToken } = await signInService(req.body);

  return res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
    });
};

const signOut = (req: Request, res: Response) => {
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export { signUp, signIn, signOut };
