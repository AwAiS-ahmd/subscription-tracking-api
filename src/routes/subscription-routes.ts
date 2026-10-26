import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  createSub,
  getAllSubs,

} from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/auth-middleware.js";

const subscriptionRouter = express.Router();
subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getAllSubs);

subscriptionRouter.post("/", createSub);

subscriptionRouter.get("/upcoming-renewals", (req: Request, res: Response) => {
  res.send(" get upcoming subscription");
});

subscriptionRouter.get("/:id", () => {});

subscriptionRouter.patch("/:id", (req: Request, res: Response) => {
  res.send("update a subscription");
});

subscriptionRouter.delete("/:id", (req: Request, res: Response) => {
  res.send("delete a subscription");
});
subscriptionRouter.get("/user/:id", (req: Request, res: Response) => {
  res.send("fetch all user subscription");
});
subscriptionRouter.patch("/:id/cancel", (req: Request, res: Response) => {
  res.send("cancel a user subscription");
});

export default subscriptionRouter;
