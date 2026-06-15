"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { TripList } from "@/components/trip/TripList";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Trip, TripFilter } from "@/types/trip";

const PAGE_SIZE = 10;

interface TripFilterTabsProps {
  initialTrips: Trip[];
  currentFilter: TripFilter;
  currentLimit: number;
  totalTripsCount: number;
  totalMemorableCount: number;
}

export function TripFilterTabs({
  initialTrips,
  currentFilter,
  currentLimit,
  totalTripsCount,
  totalMemorableCount,
}: TripFilterTabsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "memorable") {
      startTransition(() => {
        router.push(`/?filter=${value}&limit=${PAGE_SIZE}`, { scroll: false });
      });
    }
  };

  const handleLoadMore = () => {
    const nextLimit = currentLimit + PAGE_SIZE;
    startTransition(() => {
      router.push(`/?filter=${currentFilter}&limit=${nextLimit}`, { scroll: false });
    });
  };

  const handleTripsChanged = () => {
    // Next.js Server Action revalidation automatically updates our route data.
  };

  const totalCount = currentFilter === "all" ? totalTripsCount : totalMemorableCount;
  const hasMore = initialTrips.length < totalCount;

  return (
    <Tabs value={currentFilter} onValueChange={handleFilterChange}>
      <TabsList aria-label="Filter trips">
        <TabsTrigger value="all" disabled={isPending}>
          All trips
        </TabsTrigger>
        <TabsTrigger value="memorable" disabled={isPending}>
          Memorable
        </TabsTrigger>
      </TabsList>
      <TabsContent value={currentFilter}>
        <TripList
          trips={initialTrips}
          onTripsChanged={handleTripsChanged}
          isLoading={isPending}
          emptyState={
            currentFilter === "memorable" ? (
              <EmptyState
                title="No memorable trips yet"
                description="Star a trip that stood out and it will appear here for easy recall."
                actionLabel="Browse all trips"
                onAction={() => handleFilterChange("all")}
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
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-36 transition-all duration-200 hover:bg-secondary/20"
            >
              {isPending && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              Load more
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
