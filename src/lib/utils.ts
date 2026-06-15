import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const distanceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatDistance(distance: number): string {
  return `${distanceFormatter.format(distance)} km`;
}

export function formatTripDate(date: Date): string {
  return format(date, "MMM d, yyyy · h:mm a");
}

export function formatTripDay(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatTripTimeRange(startTime: Date, endTime: Date): string {
  return `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`;
}

export function formatDateTimeInput(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
