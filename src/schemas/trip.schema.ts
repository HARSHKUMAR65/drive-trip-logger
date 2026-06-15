import { format, isValid, parse } from "date-fns";
import { z } from "zod";

export const MAX_NOTES_LENGTH = 500;
const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm";
const DATE_TIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const requiredLocation = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(120, `${label} must be 120 characters or fewer`);

const dateTimeField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine(
      (value) => {
        if (DATE_TIME_LOCAL_PATTERN.test(value)) {
          const parsedDate = parse(value, DATE_TIME_LOCAL_FORMAT, new Date());
          return (
            isValid(parsedDate) &&
            format(parsedDate, DATE_TIME_LOCAL_FORMAT) === value
          );
        }

        // Match ISO 8601 string format (e.g. 2026-06-15T17:32:00.000Z or with offsets)
        const isIsoString =
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value) ||
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|[+-]\d{4})$/.test(value);
        
        if (isIsoString) {
          const date = new Date(value);
          return isValid(date) && !Number.isNaN(date.getTime());
        }

        return false;
      },
      {
        message: `Enter a valid ${label.toLowerCase()}`,
      },
    );

export const tripFormSchema = z
  .object({
    startLocation: requiredLocation("Start location"),
    endLocation: requiredLocation("End location"),
    startTime: dateTimeField("Departure time"),
    endTime: dateTimeField("Arrival time"),
    distance: z
      .number({ message: "Distance is required" })
      .finite("Enter a valid distance")
      .positive("Distance must be greater than 0")
      .max(100000, "Distance must be 100,000 km or fewer"),
    notes: z
      .string()
      .max(
        MAX_NOTES_LENGTH,
        `Notes must be ${MAX_NOTES_LENGTH} characters or fewer`,
      ),
  })
  .refine(
    (data) => new Date(data.endTime).getTime() > new Date(data.startTime).getTime(),
    {
      message: "Arrival time must be after departure time",
      path: ["endTime"],
    },
  );

export type TripFormValues = z.infer<typeof tripFormSchema>;
