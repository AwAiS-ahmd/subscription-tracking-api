import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.util.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Zod validation errors → 400 with field-level details
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  let statusCode = 500;
  let status = "error";
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else {
    console.error(err);
  }

  return res.status(statusCode).json({ status, message });
};

export default errorHandler;
