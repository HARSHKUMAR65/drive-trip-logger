export interface Trip {
  publicId: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  notes: string | null;
  memorable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripInput {
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  notes?: string | null;
  memorable?: boolean;
}

export type UpdateTripInput = Partial<CreateTripInput>;

export interface TripSummary {
  totalTrips: number;
  totalDistance: number;
  memorableTrips: number;
}

export type TripFilter = "all" | "memorable";

export interface ServerActionResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
}
