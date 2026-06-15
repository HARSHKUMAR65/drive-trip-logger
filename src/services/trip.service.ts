import type { Trip as PrismaTrip } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  CreateTripInput,
  PaginatedTrips,
  Trip,
  TripFilter,
  TripSummary,
  UpdateTripInput,
} from "@/types/trip";
import { normalizePageSize } from "@/lib/trip-query";

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
  page: number,
  pageSize: number,
): Promise<PaginatedTrips> {
  try {
    const where = filter === "memorable" ? { memorable: true } : undefined;
    const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
    const normalizedPageSize = normalizePageSize(pageSize);
    const totalCount = await prisma.trip.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / normalizedPageSize));
    const currentPage = Math.min(normalizedPage, totalPages);

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { startTime: "desc" },
      skip: (currentPage - 1) * normalizedPageSize,
      take: normalizedPageSize,
    });

    return {
      trips: trips.map(toTrip),
      totalCount,
      totalPages,
      currentPage,
    };
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
    const updates: Partial<CreateTripInput> = {
      ...(data.startLocation !== undefined && {
        startLocation: data.startLocation,
      }),
      ...(data.endLocation !== undefined && {
        endLocation: data.endLocation,
      }),
      ...(data.startTime !== undefined && { startTime: data.startTime }),
      ...(data.endTime !== undefined && { endTime: data.endTime }),
      ...(data.distance !== undefined && { distance: data.distance }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.memorable !== undefined && { memorable: data.memorable }),
    };
    const trip = await prisma.trip.update({
      where: { publicId },
      data: updates,
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
    const current = await prisma.trip.findUnique({
      where: { publicId },
      select: { memorable: true },
    });

    if (!current) {
      throw new Error("Trip not found");
    }

    const trip = await prisma.trip.update({
      where: { publicId },
      data: { memorable: !current.memorable },
    });

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
