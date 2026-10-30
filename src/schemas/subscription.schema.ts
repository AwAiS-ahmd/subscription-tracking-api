import { z } from "zod";
import {
    Currency,
    Frequency,
    Category,
    PaymentMethod,
} from "../generated/prisma/client.js";

export const createSubscriptionSchema = z.object({
    name: z.string().min(1, "Subscription name is required"),
    price: z.number().positive("Price must be a positive number"),
    currency: z.nativeEnum(Currency, {
        error: `Currency must be one of: ${Object.values(Currency).join(", ")}`,
    }),
    frequency: z.nativeEnum(Frequency, {
        error: `Frequency must be one of: ${Object.values(Frequency).join(", ")}`,
    }),
    category: z.nativeEnum(Category, {
        error: `Category must be one of: ${Object.values(Category).join(", ")}`,
    }),
    paymentMethod: z.nativeEnum(PaymentMethod, {
        error: `PaymentMethod must be one of: ${Object.values(PaymentMethod).join(", ")}`,
    }),
    startDate: z.coerce.date({ error: "startDate must be a valid date" }),
});

// All fields optional for PATCH (startDate is not updatable) – at least one required
export const updateSubscriptionSchema = createSubscriptionSchema
    .omit({ startDate: true })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
    });

// Types inferred from schemas – no separate DTOs needed
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
