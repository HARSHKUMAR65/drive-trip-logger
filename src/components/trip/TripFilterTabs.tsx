"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { getTripsAction } from "@/actions/trip.actions";
import { EmptyState } from "@/components/common/EmptyState";
import { TripList } from "@/components/trip/TripList";
import { TripPagination } from "@/components/trip/TripPagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { PaginatedTrips, TripFilter } from "@/types/trip";

interface TripFilterTabsProps {
  initialPagination: PaginatedTrips;
  pageSize: number;
}

export function TripFilterTabs({
  initialPagination,
  pageSize,
}: TripFilterTabsProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<TripFilter>("all");
  const [pagination, setPagination] =
    useState<PaginatedTrips>(initialPagination);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadTrips = (nextFilter: TripFilter, nextPage: number) => {
    setLoadError(null);
    startTransition(async () => {
      const result = await getTripsAction(nextFilter, nextPage, pageSize);

      if (!result.success || !result.data) {
        setLoadError(result.message);
        return;
      }

      setFilter(nextFilter);
      setPagination(result.data);
    });
  };

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "memorable") {
      loadTrips(value, 1);
    }
  };

  const handleTripsChanged = () => {
    loadTrips(filter, pagination.currentPage);
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
          trips={pagination.trips}
          onTripsChanged={handleTripsChanged}
          isLoading={isPending}
          emptyState={
            filter === "memorable" ? (
              <EmptyState
                title="No memorable trips yet"
                description="Star a trip that stood out and it will appear here for easy recall."
                actionLabel="Browse all trips"
                onAction={() => loadTrips("all", 1)}
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
        <TripPagination
          pagination={pagination}
          pageSize={pageSize}
          isLoading={isPending}
          onPageChange={(page) => loadTrips(filter, page)}
        />
      </TabsContent>
    </Tabs>
  );
}
