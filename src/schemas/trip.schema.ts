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
        if (!DATE_TIME_LOCAL_PATTERN.test(value)) {
          return false;
        }

        const parsedDate = parse(value, DATE_TIME_LOCAL_FORMAT, new Date());

        return (
          isValid(parsedDate) &&
          format(parsedDate, DATE_TIME_LOCAL_FORMAT) === value
        );
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
      .positive("Distance must be greater than 0"),
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
