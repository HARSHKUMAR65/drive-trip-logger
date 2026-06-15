import type { Trip as PrismaTrip } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  CreateTripInput,
  Trip,
  TripFilter,
  TripSummary,
  UpdateTripInput,
} from "@/types/trip";

function serviceError(operation: string, error: unknown): Error {
  const detail = error instanceof Error ? error.message : "Unknown database error";
  return new Error(`Unable to ${operation}: ${detail}`);
}

function toTrip(trip: PrismaTrip): Trip {
  return {
    publicId: trip.publicId,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    startTime: trip.startTime,
    endTime: trip.endTime,
    distance: trip.distance,
    notes: trip.notes,
    memorable: trip.memorable,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

export async function getAllTrips(
  filter: TripFilter,
  limit?: number,
  offset?: number,
): Promise<Trip[]> {
  try {
    const where = filter === "memorable" ? { memorable: true } : undefined;

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { startTime: "desc" },
      ...(limit !== undefined && { take: limit }),
      ...(offset !== undefined && { skip: offset }),
    });

    return trips.map(toTrip);
  } catch (error) {
    throw serviceError("load trips", error);
  }
}

export async function getTripByPublicId(
  publicId: string,
): Promise<Trip | null> {
  try {
    const trip = await prisma.trip.findUnique({ where: { publicId } });
    return trip ? toTrip(trip) : null;
  } catch (error) {
    throw serviceError("load the trip", error);
  }
}

export async function createTrip(data: CreateTripInput): Promise<Trip> {
  try {
    const trip = await prisma.trip.create({ data });
    return toTrip(trip);
  } catch (error) {
    throw serviceError("create the trip", error);
  }
}

export async function updateTrip(
  publicId: string,
  data: UpdateTripInput,
): Promise<Trip> {
  try {
    const trip = await prisma.trip.update({
      where: { publicId },
      data,
    });

    return toTrip(trip);
  } catch (error) {
    throw serviceError("update the trip", error);
  }
}

export async function deleteTrip(publicId: string): Promise<void> {
  try {
    await prisma.trip.delete({ where: { publicId } });
  } catch (error) {
    throw serviceError("delete the trip", error);
  }
}

export async function toggleMemorable(publicId: string): Promise<Trip> {
  try {
    const result = await prisma.$queryRaw<PrismaTrip[]>`
      UPDATE "Trip"
      SET "memorable" = NOT "memorable"
      WHERE "publicId" = ${publicId}::uuid
      RETURNING *
    `;

    const trip = result[0];
    if (!trip) {
      throw new Error("Trip not found");
    }

    return toTrip(trip);
  } catch (error) {
    throw serviceError("update memorable status", error);
  }
}

export async function getTripSummary(): Promise<TripSummary> {
  try {
    const [totalTrips, distance, memorableTrips] = await prisma.$transaction([
      prisma.trip.count(),
      prisma.trip.aggregate({ _sum: { distance: true } }),
      prisma.trip.count({ where: { memorable: true } }),
    ]);

    return {
      totalTrips,
      totalDistance: distance._sum.distance ?? 0,
      memorableTrips,
    };
  } catch (error) {
    throw serviceError("load the trip summary", error);
  }
}
