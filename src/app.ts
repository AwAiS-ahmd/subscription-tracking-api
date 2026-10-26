import workflowRouter from "./routes/workflow-route.js";
import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";
import subscriptionRouter from "./routes/subscription-routes.js";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError.util.js";
import { arcjetMiddleware } from "./middlewares/arcjet-middleware.js";
import express, {
  urlencoded,
  type Express,
  type Request,
  type Response,
} from "express";
import errorHandler from "./middlewares/globalErrorHandler.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);
export default app;
