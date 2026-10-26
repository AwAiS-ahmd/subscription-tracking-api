import { emailTemplates } from "./email-template.js";
import type {
  SendReminderEmailParams,
  SubscriptionEmailData,
} from "../types/email-reminder-type.js";

import { resend } from "../lib/resend.js";

export const sendReminderEmail = async ({
  to,
  type,
  subscription,
}: SendReminderEmailParams) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Invalid email type");

  const renewalDate = new Date(subscription.renewalDate);
  if (isNaN(renewalDate.getTime())) throw new Error("Invalid renewal date");

  const mailInfo: SubscriptionEmailData = {
    ...subscription,
    renewalDate,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(subscription.subscriptionName);

  const { data, error } = await resend.emails.send({
    from: "Subs Tracker <onboarding@resend.dev>",
    to,
    subject: subject,
    html: message,
  });

  if (error) {
    throw new Error(`Failed to send reminder email: ${error.message}`);
  }

  return data;
};
