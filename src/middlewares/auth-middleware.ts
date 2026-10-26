import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/auth-type.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.util.js";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;
  if (!accessToken) throw new AppError(401, "Unauthorize");

  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_SECRET!,
  ) as JwtPayload;
  const { id, role } = decoded;
  const user = await prisma.user.findUnique({
    where: { id: id, role: role },
    omit: { password: true },
  });
  if (!user) throw new AppError(401, "Unauthorize");
  req.user = user;
  next();
};
