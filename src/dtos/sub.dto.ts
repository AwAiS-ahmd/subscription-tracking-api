import {
  Currency,
  Frequency,
  Category,
  PaymentMethod,
} from "../generated/prisma/client.js";

export interface CreateSubscriptionDTO {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: PaymentMethod;
  startDate: Date;
}

export interface UpdateSubscriptionDTO {
  name?: string;
  price?: number;
  currency?: Currency;
  frequency?: Frequency;
  category?: Category;
  paymentMethod?: PaymentMethod;
}
