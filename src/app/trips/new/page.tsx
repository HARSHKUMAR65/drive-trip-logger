import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { TripForm } from "@/components/trip/TripForm";
import type { TripFormValues } from "@/schemas/trip.schema";

export const metadata = {
  title: "Add a new trip",
};

const defaultValues: TripFormValues = {
  startLocation: "",
  endLocation: "",
  startTime: "",
  endTime: "",
  distance: Number.NaN,
  notes: "",
};

export default function NewTripPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link className="transition-colors hover:text-foreground" href="/">
          Trips
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-foreground">New trip</span>
      </nav>
      <TripForm mode="create" defaultValues={defaultValues} />
    </main>
  );
}
