import { z } from "zod";

export const MAX_NOTES_LENGTH = 500;

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
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: `Enter a valid ${label.toLowerCase()}`,
    });

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
