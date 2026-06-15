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
    detail: "Logged drives",
    tone: "from-primary/10 to-secondary/50",
    iconTone: "bg-primary text-primary-foreground",
  },
  {
    key: "distance",
    label: "Distance logged",
    icon: Map,
    detail: "Across all trips",
    tone: "from-accent/45 to-card",
    iconTone: "bg-accent text-accent-foreground",
  },
  {
    key: "memorable",
    label: "Memorable trips",
    icon: Star,
    detail: "Starred moments",
    tone: "from-amber-50 to-card",
    iconTone: "bg-amber-100 text-amber-700",
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
          <Card
            key={item.key}
            className={`overflow-hidden bg-gradient-to-br ${item.tone} p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
                  {values[item.key]}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${item.iconTone}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
