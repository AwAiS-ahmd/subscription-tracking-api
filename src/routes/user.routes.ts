import express, { type Request, type Response } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.use(authorize);
userRouter.get("/", getAllUsers);

userRouter.get("/:id", getUserById);

userRouter.post("/", (req: Request, res: Response) => {
  res.send("Admin only");
});

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
