import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
export default authRouter;
