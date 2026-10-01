import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import type { SignInDto } from "../../dtos/auth.dto.js";
import AppError from "../../utils/AppError.js";
import jwt from "jsonwebtoken";

const signInService = async (userData: SignInDto) => {
  const isUser = await prisma.user.findUnique({
    where: { email: userData.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      role: true,
    },
  });
  if (!isUser) {
    throw new AppError(401, "Invalid email or password");
  }
  const isValid = await bcrypt.compare(userData.password, isUser.password);
  if (!isValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign({id:isUser.id,role:isUser.role}, process.env.JWT_SECRET!, {
    expiresIn: process.env.EXPIRES_IN as any,
  });
  const { password, ...user } = isUser;

  return { accessToken, user };
};

export default signInService;
