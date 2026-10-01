import { type Request, type Response } from "express";
import type { SignUpDto, SignInDto } from "../dtos/auth.dto.js";
import signUpService from "../services/auth-service/sign-up.service.js";
import signInService from "../services/auth-service/sign-in.service.js";

const signUp = async (req: Request<{}, {}, SignUpDto>, res: Response) => {
  const { accessToken, user } = await signUpService(req.body);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV! === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    })
    .status(201)
    .json({
      success: true,
      data: user,
    });
};

const signIn = async (req: Request<{}, {}, SignInDto>, res: Response) => {
  const { accessToken } = await signInService(req.body);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV! === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in sucessfully",
    });

};

const signOut = (req: Request, res: Response) => {
  res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export { signUp, signIn, signOut };
