import type {
  RenewalEmailParams,
  SubscriptionEmailData,
  EmailTemplate,
} from "../types/email-reminder-type.js";

const formatRenewalDate = (date: Date): string => {
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid renewal date");
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatPrice = (price: number, currency = "USD"): string => {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid subscription price");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => ENTITIES[char]!);

export const generateEmailTemplate = (data: RenewalEmailParams): string => {
  const formattedDate = formatRenewalDate(data.renewalDate);
  const formattedPrice = formatPrice(data.price);

  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">SubDub</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${data.userName}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${data.subscriptionName}</strong> subscription is set to renew on <strong style="color: #4a90e2;">${data.renewalDate}</strong> (${data.daysLeft} days from today).</p>
                
                <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 25px;">
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Plan:</strong> ${data.planName}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Price:</strong> ${data.price}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px;">
                            <strong>Payment Method:</strong> ${data.paymentMethod}
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your subscription, please visit your <a href="${data.accountSettingsLink}" style="color: #4a90e2; text-decoration: none;">account settings</a> before the renewal date.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">Need help? <a href="${data.supportLink}" style="color: #4a90e2; text-decoration: none;">Contact our support team</a> anytime.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The SubDub Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    SubDub Inc. | 123 Main St, Anytown, AN 12345
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`;
};

export const emailTemplates: Array<EmailTemplate> = [
  {
    label: "7 days before reminder",
    generateSubject: (subscriptionName: string) =>
      `⏳ ${subscriptionName} Renews in 7 Days – Stay Subscribed!`,
    generateBody: (data: SubscriptionEmailData) =>
      generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "5 days before reminder",
    generateSubject: (subscriptionName: string) =>
      `🚀 5 Days Left!  ${subscriptionName} Subscription Renewal`,
    generateBody: (data: SubscriptionEmailData) =>
      generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "1 days before reminder",
    generateSubject: (subscriptionName: string) =>
      `⚡ Final Reminder: ${subscriptionName} Renews Tomorrow!`,
    generateBody: (data: SubscriptionEmailData) =>
      generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
];
