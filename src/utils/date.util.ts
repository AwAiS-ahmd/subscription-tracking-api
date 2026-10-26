import { Frequency } from "../generated/prisma/client.js";
import { addWeeks, addMonths, addYears } from "date-fns";
import AppError from "./AppError.util.js";

export function calculateNextRenewalDate(
  currentDate: Date,
  frequency: Frequency,
): Date {
  switch (frequency) {
    case Frequency.WEEKLY:
      return addWeeks(currentDate, 1);

    case Frequency.MONTHLY:
      return addMonths(currentDate, 1);

    case Frequency.YEARLY:
      return addYears(currentDate, 1);

    default:
      throw new AppError(400, `Unsupported frequency: ${frequency}`);
  }
}
