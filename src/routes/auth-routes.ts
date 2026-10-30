import express from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { signUpSchema, signInSchema } from "../schemas/auth.schema.js";

const authRouter = express.Router();

authRouter.post("/sign-up", validate(signUpSchema), signUp);
authRouter.post("/sign-in", validate(signInSchema), signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
