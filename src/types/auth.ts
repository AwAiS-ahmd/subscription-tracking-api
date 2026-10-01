import type { Prisma } from "../generated/prisma/client.js";

export interface JwtPayload {
  id: string;
  role: "USER" | "ADMIN";
}

export type AuthUser = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;
