import { prisma } from "../../lib/prisma.js";
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../../schemas/subscription.schema.js";
import { calculateNextRenewalDate } from "../../utils/date.util.js";
import AppError from "../../utils/AppError.util.js";


export const createSubService = async (
  data: CreateSubscriptionInput,
  userId: string,
) => {
  const subscription = await prisma.subscription.create({
    data: {
      ...data,
      userId,
      renewalDate: calculateNextRenewalDate(data.startDate, data.frequency),
    },
  });
  return subscription;
};

export const getSubService = async (userId: string) => {
  return prisma.subscription.findMany({ where: { userId } });
};

export const getSubByIdService = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!subscription) throw new AppError(404, "Subscription not found");

  // Ensure the subscription belongs to the requesting user
  if (subscription.userId !== userId) throw new AppError(403, "Forbidden");

  return subscription;
};

export const updateSubService = async (
  id: string,
  userId: string,
  data: UpdateSubscriptionInput,
) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });

  if (!subscription) throw new AppError(404, "Subscription not found");
  if (subscription.userId !== userId) throw new AppError(403, "Forbidden");

  // Strip undefined values so exactOptionalPropertyTypes is satisfied
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );

  return prisma.subscription.update({
    where: { id },
    data: cleanData,
  });
};

export const deleteSubService = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });

  if (!subscription) throw new AppError(404, "Subscription not found");
  if (subscription.userId !== userId) throw new AppError(403, "Forbidden");

  await prisma.subscription.delete({ where: { id } });
};

export const getUserSubsService = async (
  targetUserId: string,
  requesterId: string,
) => {
  // Only allow admins or the owner to fetch another user's subscriptions
  if (targetUserId !== requesterId)
    throw new AppError(403, "Forbidden");

  return prisma.subscription.findMany({ where: { userId: targetUserId } });
};

export const cancelSubService = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });

  if (!subscription) throw new AppError(404, "Subscription not found");
  if (subscription.userId !== userId) throw new AppError(403, "Forbidden");
  if (subscription.status === "CANCELLED")
    throw new AppError(400, "Subscription is already cancelled");

  return prisma.subscription.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};
