import { Map, Route, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import type { TripSummary } from "@/types/trip";

interface SummaryCardsProps {
  summary: TripSummary;
}

const summaryItems = [
  {
    key: "trips",
    label: "Total trips",
    icon: Route,
  },
  {
    key: "distance",
    label: "Distance logged",
    icon: Map,
  },
  {
    key: "memorable",
    label: "Memorable trips",
    icon: Star,
  },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  const values = {
    trips: summary.totalTrips.toLocaleString("en-US"),
    distance: formatDistance(summary.totalDistance),
    memorable: summary.memorableTrips.toLocaleString("en-US"),
  };

  return (
    <section
      className="grid gap-3 sm:grid-cols-3 sm:gap-4"
      aria-label="Trip summary"
    >
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key} className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
                  {values[item.key]}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
