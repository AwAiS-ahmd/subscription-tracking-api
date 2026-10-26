import type { Request, Response } from "express";
import {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/user-service/userService.js";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsersService();
  return res.status(200).json({ success: true, data: users });
};
const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(id);
  return res.status(200).json({ success: true, data: user });
};
const updateUser = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = await updateUserService(id, { name });
  return res
    .status(200)
    .json({ success: true, message: "User updated successfully", data: user });
};

const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  await deleteUserService(id);
  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully" });
};

export { getAllUsers, getUserById, updateUser, deleteUser };
