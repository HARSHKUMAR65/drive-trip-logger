"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTrip,
  deleteTrip,
  toggleMemorable,
  updateTrip,
} from "@/services/trip.service";
import {
  tripFormSchema,
  type TripFormValues,
} from "@/schemas/trip.schema";
import type {
  CreateTripInput,
  ServerActionResult,
  Trip,
  UpdateTripInput,
} from "@/types/trip";

const publicIdSchema = z
  .string()
  .trim()
  .uuid("A valid trip identifier is required");

function validationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form and try again";
}

function toCreateInput(values: TripFormValues): CreateTripInput {
  return {
    startLocation: values.startLocation,
    endLocation: values.endLocation,
    startTime: new Date(values.startTime),
    endTime: new Date(values.endTime),
    distance: values.distance,
    notes: values.notes.trim() || null,
  };
}

export async function createTripAction(
  input: TripFormValues,
): Promise<ServerActionResult<Trip>> {
  const parsed = tripFormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  try {
    const trip = await createTrip(toCreateInput(parsed.data));
    revalidatePath("/");
    return {
      success: true,
      message: "Trip added successfully",
      data: trip,
    };
  } catch (error) {
    console.error("Error in createTripAction:", error);
    return {
      success: false,
      message: "Failed to add trip. Please try again.",
    };
  }
}

export async function updateTripAction(
  publicId: string,
  input: TripFormValues,
): Promise<ServerActionResult<Trip>> {
  const parsedPublicId = publicIdSchema.safeParse(publicId);
  const parsed = tripFormSchema.safeParse(input);

  if (!parsedPublicId.success) {
    return {
      success: false,
      message: validationMessage(parsedPublicId.error),
    };
  }

  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  try {
    const data: UpdateTripInput = {
      ...toCreateInput(parsed.data),
    };
    const trip = await updateTrip(parsedPublicId.data, data);
    revalidatePath("/");
    return {
      success: true,
      message: "Trip updated",
      data: trip,
    };
  } catch (error) {
    console.error("Error in updateTripAction:", error);
    return {
      success: false,
      message: "Failed to save trip. Please try again.",
    };
  }
}

export async function deleteTripAction(
  publicId: string,
): Promise<ServerActionResult<{ publicId: string }>> {
  const parsed = publicIdSchema.safeParse(publicId);

  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  try {
    await deleteTrip(parsed.data);
    revalidatePath("/");
    return {
      success: true,
      message: "Trip deleted",
      data: { publicId: parsed.data },
    };
  } catch (error) {
    console.error("Error in deleteTripAction:", error);
    return {
      success: false,
      message: "Failed to delete trip. Please try again.",
    };
  }
}

export async function toggleMemorableAction(
  publicId: string,
): Promise<ServerActionResult<Trip>> {
  const parsed = publicIdSchema.safeParse(publicId);

  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  try {
    const trip = await toggleMemorable(parsed.data);
    revalidatePath("/");
    return {
      success: true,
      message: trip.memorable
        ? "Marked as memorable"
        : "Removed from memorable",
      data: trip,
    };
  } catch (error) {
    console.error("Error in toggleMemorableAction:", error);
    return {
      success: false,
      message: "Failed to update memorable status. Please try again.",
    };
  }
}

