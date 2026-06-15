import Link from "next/link";
import { Plus, Route, Sparkles, Star } from "lucide-react";

import { SummaryCards } from "@/components/trip/SummaryCards";
import { TripFilterTabs } from "@/components/trip/TripFilterTabs";
import { Button } from "@/components/ui/button";
import { renderDynamically } from "@/lib/route-rendering";
import { getAllTrips, getTripSummary } from "@/services/trip.service";

export default async function HomePage() {
  await renderDynamically();

  const [trips, summary] = await Promise.all([
    getAllTrips("all"),
    getTripSummary(),
  ]);

  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-secondary/70 to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-primary uppercase">
              Your driving journal
            </p>
            <h1 className="text-4xl font-bold tracking-[-0.055em] text-balance sm:text-5xl">
              Every drive has a story.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Keep the practical details and the moments that made the road
              matter, all in one quiet place.
            </p>
          </div>

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
          <TripFilterTabs initialTrips={trips} />
        </section>
      </div>
    </main>
  );
}
