import type { Currency, Frequency } from "../generated/prisma/enums.js";

export type ReminderType =
  | "7 days before reminder"
  | "5 days before reminder"
  | "1 days before reminder";

export type SubscriptionEmailData = {
  userName: string;
  subscriptionName: string;
  renewalDate: Date;
  planName: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  paymentMethod: string;
  accountSettingsLink: string;
  supportLink: string;
};

export type SubscriptionEmailInput = Omit<
  SubscriptionEmailData,
  "renewalDate"
> & {
  renewalDate: Date | string;
};

/** What the HTML renderer needs */
export type RenewalEmailParams = SubscriptionEmailData & {
  daysLeft: number;
};

export type EmailTemplate = {
  label: ReminderType;
  generateSubject: (subscriptionName: string) => string;
  generateBody: (data: SubscriptionEmailData) => string;
};

export type SendReminderEmailParams = {
  to: string;
  type: ReminderType;
  subscription: SubscriptionEmailInput;
};
