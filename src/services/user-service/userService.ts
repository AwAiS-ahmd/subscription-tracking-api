import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.util.js";

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({ omit: { password: true } });
  if (users.length === 0) throw new AppError(404, "Failed to fetch users");
  return users;
};

export const getUserByIdService = async (id: string) => {
  const users = await prisma.user.findUnique({
    where: { id: id },
    omit: { password: true },
  });
  if (!users) throw new AppError(404, "User not found");
  return users;
};

export const updateUserService = async (
  id: string,
  data: { name?: string },
) => {
  const users = await prisma.user.update({
    where: { id: id },
    data,
    omit: { password: true },
  });

  return users;
};

export const deleteUserService = async (id: string) => {
  const users = await prisma.user.delete({ where: { id: id } });
  return users;
};
