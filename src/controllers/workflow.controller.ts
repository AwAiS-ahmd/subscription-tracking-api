import type { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import { isAfter, subDays } from "date-fns";
import { prisma } from "../lib/prisma.js";
import { sendReminderEmail } from "../utils/send-email.js";
import type { ReminderType } from "../types/email-reminder-type.js";

const REMINDERS = [7, 5, 1] as const;

const REMINDER_TYPES: Record<(typeof REMINDERS)[number], ReminderType> = {
  7: "7 days before reminder",
  5: "5 days before reminder",
  1: "1 days before reminder",
};

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

const formatEnum = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const sendReminder = serve<{ subscriptionId: string }>(
  async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(
      context,
      subscriptionId,
      "fetch-subscription",
    );

    if (!subscription || subscription.status !== "ACTIVE") return;

    const now = await context.run("get-current-time", () =>
      new Date().toISOString(),
    );
    const currentTime = new Date(now);

    if (!isAfter(subscription.renewalDate, currentTime)) {
      console.log(`Renewal date has passed for ${subscriptionId}`);
      return;
    }

    for (const daysBefore of REMINDERS) {
      const reminderDate = subDays(subscription.renewalDate, daysBefore);

      // Skip reminders whose time has already passed.
      if (!isAfter(reminderDate, currentTime)) {
        console.log(`Skipping overdue ${daysBefore}-day reminder`);
        continue;
      }

      await context.sleepUntil(`sleep-${daysBefore}-day-reminder`, reminderDate);

      // Re-read the latest state after waking up.
      const latest = await fetchSubscription(
        context,
        subscriptionId,
        `refetch-before-${daysBefore}-day-reminder`,
      );

      if (!latest || latest.status !== "ACTIVE") return;

      // Renewal date changed: a newer workflow owns this subscription.
      if (latest.renewalDate.getTime() !== subscription.renewalDate.getTime()) {
        console.log(
          `Renewal date changed for ${subscriptionId}. Stopping old workflow.`,
        );
        return;
      }

      await sendReminder_(
        context,
        `send-${daysBefore}-day-reminder`,
        REMINDER_TYPES[daysBefore],
        latest,
      );
    }
  },
);

const fetchSubscription = async (
  context: WorkflowContext,
  subscriptionId: string,
  label: string,
) => {
  const sub = await context.run(label, () =>
    prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: { select: { name: true, email: true } } },
    }),
  );

  if (!sub) return null;

  // Step results are JSON-serialized, so dates arrive as strings.
  return { ...sub, renewalDate: new Date(sub.renewalDate) };
};

type SubscriptionWithUser = NonNullable<
  Awaited<ReturnType<typeof fetchSubscription>>
>;

const sendReminder_ = async (
  context: WorkflowContext,
  label: string,
  type: ReminderType,
  sub: SubscriptionWithUser,
) => {
  await context.run(label, async () => {
    await sendReminderEmail({
      to: sub.user.email,
      type,
      subscription: {
        userName: sub.user.name,
        subscriptionName: sub.name,
        renewalDate: sub.renewalDate,
        planName: formatEnum(sub.category),
        price: Number(sub.price), // Decimal arrives as a string
        currency: sub.currency,
        frequency: sub.frequency,
        paymentMethod: formatEnum(sub.paymentMethod),
        accountSettingsLink: `${APP_URL}/settings`,
        supportLink: `${APP_URL}/support`,
      },
    });
  });
};