import { aj } from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.util.js";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const decision = await aj.protect(req, { requested: 1 });

  if (decision.isDenied() && decision.reason.isRateLimit()) {
    throw new AppError(429, "Too Many Requests");
  }

  if (
    process.env.NODE_ENV === "production" &&
    decision.isDenied() &&
    decision.reason.isBot()
  ) {
    throw new AppError(403, "No bots allowed");
  }

  if (process.env.NODE_ENV === "production") {
    if (decision.ip.isHosting()) {
      throw new AppError(403, "Forbidden");
    }

    if (decision.results.some(isSpoofedBot)) {
      throw new AppError(403, "Forbidden");
    }
  }

  next();
};
