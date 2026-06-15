"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { getTripsAction } from "@/actions/trip.actions";
import { EmptyState } from "@/components/common/EmptyState";
import { TripList } from "@/components/trip/TripList";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Trip, TripFilter } from "@/types/trip";

interface TripFilterTabsProps {
  initialTrips: Trip[];
}

export function TripFilterTabs({ initialTrips }: TripFilterTabsProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<TripFilter>("all");
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadTrips = (nextFilter: TripFilter) => {
    setLoadError(null);
    startTransition(async () => {
      const result = await getTripsAction(nextFilter);

      if (!result.success || !result.data) {
        setLoadError(result.message);
        return;
      }

      setFilter(nextFilter);
      setTrips(result.data);
    });
  };

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "memorable") {
      loadTrips(value);
    }
  };

  const handleTripsChanged = () => {
    loadTrips(filter);
    router.refresh();
  };

  return (
    <Tabs value={filter} onValueChange={handleFilterChange}>
      <TabsList aria-label="Filter trips">
        <TabsTrigger value="all" disabled={isPending}>
          All trips
        </TabsTrigger>
        <TabsTrigger value="memorable" disabled={isPending}>
          Memorable
        </TabsTrigger>
      </TabsList>
      <TabsContent value={filter}>
        {loadError ? (
          <p
            className="mb-4 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm font-medium text-destructive"
            role="alert"
          >
            {loadError}
          </p>
        ) : null}
        <TripList
          trips={trips}
          onTripsChanged={handleTripsChanged}
          isLoading={isPending}
          emptyState={
            filter === "memorable" ? (
              <EmptyState
                title="No memorable trips yet"
                description="Star a trip that stood out and it will appear here for easy recall."
                actionLabel="Browse all trips"
                onAction={() => loadTrips("all")}
              />
            ) : (
              <EmptyState
                title="Your road starts here"
                description="Log your first drive to keep the route, timing, distance, and moments worth remembering in one place."
                actionLabel="Log your first trip"
                actionHref="/trips/new"
              />
            )
          }
        />
      </TabsContent>
    </Tabs>
  );
}
