"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { deleteTripAction } from "@/actions/trip.actions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { MemorableToggle } from "@/components/trip/MemorableToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDistance,
  formatTripDay,
  formatTripTimeRange,
} from "@/lib/utils";
import type { Trip } from "@/types/trip";

interface TripListProps {
  trips: Trip[];
  emptyState: React.ReactNode;
  onTripsChanged: () => void;
  isLoading?: boolean;
}

interface TripRowProps {
  trip: Trip;
  onTripsChanged: () => void;
}

function stopRowNavigation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

function useOpenTripEditor(publicId: string) {
  const router = useRouter();
  const href = `/trips/${publicId}/edit`;

  const openEditor = () => {
    router.push(href);
  };

  return { href, openEditor };
}

function TripActions({ trip, onTripsChanged }: TripRowProps) {
  const { href } = useOpenTripEditor(trip.publicId);

  const handleDelete = async (): Promise<string | null> => {
    const result = await deleteTripAction(trip.publicId);

    if (!result.success) {
      toast.error(result.message);
      return result.message;
    }

    toast.success(result.message);
    onTripsChanged();
    return null;
  };

  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={stopRowNavigation}
      onKeyDown={stopRowNavigation}
    >
      <Button
        asChild
        variant="ghost"
        size="icon-sm"
        aria-label={`Edit trip from ${trip.startLocation} to ${trip.endLocation}`}
      >
        <Link href={href}>
          <Pencil aria-hidden="true" />
        </Link>
      </Button>
      <ConfirmDialog
        title="Delete this trip?"
        description="This action cannot be undone. The trip and its notes will be permanently removed."
        confirmLabel="Delete trip"
        onConfirm={handleDelete}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete trip from ${trip.startLocation} to ${trip.endLocation}`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        }
      />
    </div>
  );
}

function DesktopTripRow({ trip, onTripsChanged }: TripRowProps) {
  const { openEditor } = useOpenTripEditor(trip.publicId);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEditor();
    }
  };

  return (
    <TableRow
      className="cursor-pointer focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      onClick={openEditor}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`Edit trip from ${trip.startLocation} to ${trip.endLocation}`}
    >
      <TableCell className="min-w-64 max-w-80">
        <div className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="truncate">{trip.startLocation}</span>
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate">{trip.endLocation}</span>
        </div>
      </TableCell>
      <TableCell className="min-w-44">
        <p className="font-medium">{formatTripDay(trip.startTime)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatTripTimeRange(trip.startTime, trip.endTime)}
        </p>
      </TableCell>
      <TableCell className="whitespace-nowrap font-semibold">
        {formatDistance(trip.distance)}
      </TableCell>
      <TableCell className="max-w-72">
        <p className="truncate text-muted-foreground">
          {trip.notes || "No notes"}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5" onClick={stopRowNavigation}>
          <MemorableToggle
            tripPublicId={trip.publicId}
            memorable={trip.memorable}
            onChanged={onTripsChanged}
          />
          {trip.memorable ? (
            <Badge variant="memorable" className="hidden xl:inline-flex">
              <Star className="size-3 fill-current" aria-hidden="true" />
              Memorable
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="w-24">
        <TripActions trip={trip} onTripsChanged={onTripsChanged} />
      </TableCell>
    </TableRow>
  );
}

function MobileTripRow({ trip, onTripsChanged }: TripRowProps) {
  const { openEditor } = useOpenTripEditor(trip.publicId);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEditor();
    }
  };

  return (
    <article
      className="cursor-pointer px-4 py-4 transition-colors active:bg-muted/80 focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      onClick={openEditor}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`Edit trip from ${trip.startLocation} to ${trip.endLocation}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 font-semibold">
          <span className="truncate">{trip.startLocation}</span>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate">{trip.endLocation}</span>
        </div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {formatTripDay(trip.startTime)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{formatDistance(trip.distance)}</p>
          <p className="truncate text-xs text-muted-foreground">
            {formatTripTimeRange(trip.startTime, trip.endTime)}
          </p>
        </div>
        <div className="flex items-center gap-1" onClick={stopRowNavigation}>
          <MemorableToggle
            tripPublicId={trip.publicId}
            memorable={trip.memorable}
            onChanged={onTripsChanged}
          />
          <TripActions trip={trip} onTripsChanged={onTripsChanged} />
        </div>
      </div>
    </article>
  );
}

export function TripList({
  trips,
  emptyState,
  onTripsChanged,
  isLoading = false,
}: TripListProps) {
  if (trips.length === 0) {
    return emptyState;
  }

  return (
    <>
      <div
        className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-opacity data-[loading=true]:opacity-60 md:block"
        data-loading={isLoading}
      >
        <Table>
          <TableHeader className="bg-muted/55">
            <TableRow className="hover:bg-transparent">
              <TableHead>Route</TableHead>
              <TableHead>Date / time</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Memorable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <DesktopTripRow
                key={trip.publicId}
                trip={trip}
                onTripsChanged={onTripsChanged}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div
        className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-opacity data-[loading=true]:opacity-60 md:hidden"
        data-loading={isLoading}
      >
        {trips.map((trip) => (
          <MobileTripRow
            key={trip.publicId}
            trip={trip}
            onTripsChanged={onTripsChanged}
          />
        ))}
      </div>
    </>
  );
}
