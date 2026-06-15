import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { TripForm } from "@/components/trip/TripForm";
import { renderDynamically } from "@/lib/route-rendering";
import { formatDateTimeInput } from "@/lib/utils";
import { getTripByPublicId } from "@/services/trip.service";

export const metadata = {
  title: "Edit trip",
};

interface EditTripPageProps {
  params: Promise<{ publicId: string }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  await renderDynamically();

  const { publicId } = await params;
  const trip = await getTripByPublicId(publicId);

  if (!trip) {
    notFound();
  }

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
        <span className="max-w-56 truncate text-foreground">Edit trip</span>
      </nav>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-[-0.045em]">Edit Trip</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Edit: {trip.startLocation} &rarr; {trip.endLocation}
        </p>
      </div>
      <TripForm
        mode="edit"
        tripPublicId={trip.publicId}
        defaultValues={{
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
          startTime: formatDateTimeInput(trip.startTime),
          endTime: formatDateTimeInput(trip.endTime),
          distance: trip.distance,
          notes: trip.notes ?? "",
        }}
      />
    </main>
  );
}
