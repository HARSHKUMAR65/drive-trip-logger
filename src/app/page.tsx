import Link from "next/link";
import { Plus } from "lucide-react";

import { SummaryCards } from "@/components/trip/SummaryCards";
import { TripFilterTabs } from "@/components/trip/TripFilterTabs";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/lib/trip-query";
import { renderDynamically } from "@/lib/route-rendering";
import { getAllTrips, getTripSummary } from "@/services/trip.service";

export default async function HomePage() {
  await renderDynamically();

  const [pagination, summary] = await Promise.all([
    getAllTrips("all", DEFAULT_PAGE, DEFAULT_PAGE_SIZE),
    getTripSummary(),
  ]);

  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      <section className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-primary uppercase">
              Your driving journal
            </p>
            <h2 className="text-4xl font-bold tracking-[-0.055em] text-balance sm:text-5xl">
              Every drive has a story.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Keep the practical details and the moments that made the road
              matter, all in one quiet place.
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/trips/new">
              <Plus aria-hidden="true" />
              Add a new trip
            </Link>
          </Button>
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <SummaryCards summary={summary} />
        <section aria-labelledby="trip-history-heading">
          <div className="mb-5">
            <h2
              id="trip-history-heading"
              className="text-2xl font-bold tracking-[-0.035em]"
            >
              Trip history
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review every route or narrow the list to your standout drives.
            </p>
          </div>
          <TripFilterTabs
            initialPagination={pagination}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </section>
      </div>
    </main>
  );
}
