import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import type { SignUpDto } from "../../dtos/auth.dto.js";
import AppError from "../../utils/AppError.util.js";
import jwt from "jsonwebtoken";


const signUpService = async (userData: SignUpDto) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists.");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET !,
    { expiresIn: process.env.EXPIRES_IN as any },
  );


  return { user, accessToken };
};

export default signUpService;
