import express, { type Request, type Response } from "express";
import {
  createSub,
  getAllSubs,
  getSubById,
  updateSub,
  deleteSub,
  getUserSubs,
  cancelSub,
} from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/auth-middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../schemas/subscription.schema.js";

const subscriptionRouter = express.Router();
subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getAllSubs);
subscriptionRouter.post("/", validate(createSubscriptionSchema), createSub);

subscriptionRouter.get("/upcoming-renewals", (req: Request, res: Response) => {
  res.send("get upcoming subscriptions");
});

subscriptionRouter.get("/:id", getSubById);
subscriptionRouter.patch(
  "/:id",
  validate(updateSubscriptionSchema),
  updateSub,
);
subscriptionRouter.delete("/:id", deleteSub);
subscriptionRouter.get("/user/:id", getUserSubs);
subscriptionRouter.patch("/:id/cancel", cancelSub);

export default subscriptionRouter;
