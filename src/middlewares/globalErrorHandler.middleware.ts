import type { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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

  return res.status(statusCode).json({
    status,
    message,
  });
};

export default errorHandler;
