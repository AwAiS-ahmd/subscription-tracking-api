import type { Request, Response } from "express";
import {
  createSubService,
  getSubService,
  getSubByIdService,
  updateSubService,
  deleteSubService,
  getUserSubsService,
  cancelSubService,
} from "../services/subscription-service.ts/subscriptionService.js";
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../schemas/subscription.schema.js";
import { client } from "../lib/upstash-workflow.js";
import { env } from "../config/env.js";

export const createSub = async (
  req: Request<{}, {}, CreateSubscriptionInput>,
  res: Response,
) => {
  const subscription = await createSubService(req.body, req.user.id);

  let workflowRunId: string | undefined;

  try {
    const result = await client.trigger({
      url: `${env.SERVER_URL}/api/v1/workflows/reminders`,
      body: {
        subscriptionId: subscription.id,
      },
      retries: 3,
    });

    workflowRunId = result.workflowRunId;

    console.log("[Workflow] Triggered:", workflowRunId);
  } catch (err) {
    console.error(
      `[Workflow] Failed to trigger reminder for subscription ${subscription.id}:`,
      err,
    );
  }

  return res.status(201).json({
    success: true,
    message: "Subscription created successfully",
    data: {
      subscription,
      workflowRunId: workflowRunId ?? null,
    },
  });
};

export const getAllSubs = async (req: Request, res: Response) => {
  const subscriptions = await getSubService(req.user.id);

  return res.status(200).json({
    success: true,
    data: subscriptions,
  });
};

export const getSubById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const subscription = await getSubByIdService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    data: subscription,
  });
};

export const updateSub = async (
  req: Request<{ id: string }, {}, UpdateSubscriptionInput>,
  res: Response,
) => {
  const subscription = await updateSubService(
    req.params.id,
    req.user.id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Subscription updated successfully",
    data: subscription,
  });
};

export const deleteSub = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await deleteSubService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Subscription deleted successfully",
  });
};

export const getUserSubs = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const subscriptions = await getUserSubsService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    data: subscriptions,
  });
};

export const cancelSub = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const subscription = await cancelSubService(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
    data: subscription,
  });
};
