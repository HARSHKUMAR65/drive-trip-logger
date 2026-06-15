"use client";

import { useState } from "react";
import { addHours, format, isValid, parse } from "date-fns";
import { CalendarDays, Check, Clock3 } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

type Period = "AM" | "PM";

interface TripDateTimeRangePickerProps {
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  startError?: string;
  endError?: string;
}

interface TimeParts {
  hour: string;
  minute: string;
  period: Period;
}

interface TimeSelectorProps {
  id: string;
  label: string;
  date: Date | undefined;
  disabled: boolean;
  hasError: boolean;
  onChange: (parts: TimeParts) => void;
}

function parseDateTime(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = parse(value, DATE_TIME_FORMAT, new Date());
  return isValid(date) ? date : undefined;
}

function timePart(value: string, fallback: string): string {
  const date = parseDateTime(value);
  return date ? format(date, "HH:mm") : fallback;
}

function combineDateAndTime(date: Date, time: string): string {
  const [hours = "0", minutes = "0"] = time.split(":");
  const combined = new Date(date);
  combined.setHours(Number(hours), Number(minutes), 0, 0);
  return format(combined, DATE_TIME_FORMAT);
}

function getTimeParts(date: Date | undefined): TimeParts {
  if (!date) {
    return { hour: "9", minute: "00", period: "AM" };
  }

  const hour24 = date.getHours();
  return {
    hour: String(hour24 % 12 || 12),
    minute: String(date.getMinutes()).padStart(2, "0"),
    period: hour24 >= 12 ? "PM" : "AM",
  };
}

function applyTimeParts(date: Date, parts: TimeParts): string {
  const hour12 = Number(parts.hour) % 12;
  const hour24 = hour12 + (parts.period === "PM" ? 12 : 0);
  const combined = new Date(date);
  combined.setHours(hour24, Number(parts.minute), 0, 0);
  return format(combined, DATE_TIME_FORMAT);
}

function TimeSelector({
  id,
  label,
  date,
  disabled,
  hasError,
  onChange,
}: TimeSelectorProps) {
  const parts = getTimeParts(date);
  return (
    <section
      className={cn(
        "grid gap-2.5 rounded-xl border border-border bg-muted/30 p-3",
        hasError && "border-destructive/60 bg-destructive/5",
      )}
      aria-labelledby={`${id}-label`}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
            <Clock3 className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p id={`${id}-label`} className="text-sm font-semibold">
              {label}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {date ? format(date, "MMM d, yyyy") : "Select a date first"}
            </p>
          </div>
        </div>
        {date ? (
          <span className="shrink-0 text-sm font-bold text-primary">
            {format(date, "h:mm a")}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="min-w-0">
          <Select
            value={parts.hour}
            onValueChange={(hour) => onChange({ ...parts, hour })}
            disabled={disabled}
          >
            <SelectTrigger
              aria-label={`${label} hour`}
              aria-invalid={hasError}
              className="h-9 w-full bg-background"
            >
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour.padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-lg font-bold text-muted-foreground">:</span>

        <div className="min-w-0">
          <Select
            value={parts.minute}
            onValueChange={(minute) => onChange({ ...parts, minute })}
            disabled={disabled}
          >
            <SelectTrigger
              aria-label={`${label} minute`}
              aria-invalid={hasError}
              className="h-9 w-full bg-background"
            >
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-1 rounded-lg bg-background p-1 ring-1 ring-border"
        aria-label={`${label} AM or PM`}
      >
        {(["AM", "PM"] as const).map((period) => {
          const selected = parts.period === period;

          return (
            <Button
              key={period}
              type="button"
              size="sm"
              variant={selected ? "default" : "ghost"}
              className="h-8 rounded-md shadow-none"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange({ ...parts, period })}
            >
              {selected ? <Check aria-hidden="true" /> : null}
              {period}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export function TripDateTimeRangePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startError,
  endError,
}: TripDateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const startDate = parseDateTime(startValue);
  const endDate = parseDateTime(endValue);
  const selectedRange: DateRange | undefined = startDate
    ? { from: startDate, to: endDate }
    : undefined;
  const hasError = Boolean(startError || endError);

  const handleRangeChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      onStartChange("");
      onEndChange("");
      return;
    }

    const nextStart = combineDateAndTime(
      range.from,
      timePart(startValue, "09:00"),
    );
    onStartChange(nextStart);

    if (!range.to) {
      onEndChange("");
      return;
    }

    let nextEnd = combineDateAndTime(
      range.to,
      timePart(endValue, "10:00"),
    );

    if (new Date(nextEnd).getTime() <= new Date(nextStart).getTime()) {
      nextEnd = format(addHours(new Date(nextStart), 1), DATE_TIME_FORMAT);
    }

    onEndChange(nextEnd);
  };

  const updateStartTime = (parts: TimeParts) => {
    if (!startDate) {
      return;
    }

    const nextStart = applyTimeParts(startDate, parts);
    onStartChange(nextStart);

    if (endDate && endDate.getTime() <= new Date(nextStart).getTime()) {
      onEndChange(
        format(addHours(new Date(nextStart), 1), DATE_TIME_FORMAT),
      );
    }
  };

  const updateEndTime = (parts: TimeParts) => {
    if (endDate) {
      onEndChange(applyTimeParts(endDate, parts));
    }
  };

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d · h:mm a")} - ${format(endDate, "MMM d · h:mm a")}`
      : startDate
        ? `${format(startDate, "MMM d · h:mm a")} - Select end`
        : "Select dates and times";

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold" htmlFor="trip-date-range">
        Trip date and time
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="trip-date-range"
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start px-3 text-left font-normal",
              !startDate && "text-muted-foreground",
              hasError && "border-destructive",
            )}
            aria-invalid={hasError}
          >
            <CalendarDays aria-hidden="true" />
            <span className="truncate">{rangeLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className="max-h-[calc(100vh-1rem)] w-[min(46rem,calc(100vw-1rem))] gap-0 overflow-y-auto p-0"
        >
          <div className="border-b border-border bg-muted/35 px-4 py-2.5">
            <p className="text-sm font-semibold">Select trip date and time</p>
            <p className="text-xs text-muted-foreground">
              Choose both dates, then set start and end times.
            </p>
          </div>

          <div className="grid md:grid-cols-[minmax(20rem,1fr)_20rem]">
            <div className="flex items-start justify-center overflow-x-auto p-2 sm:p-3">
              <Calendar
                mode="range"
                defaultMonth={startDate}
                selected={selectedRange}
                onSelect={handleRangeChange}
                numberOfMonths={1}
                captionLayout="dropdown"
                startMonth={new Date(2000, 0)}
                endMonth={new Date(new Date().getFullYear() + 5, 11)}
                className="mx-auto [--cell-size:--spacing(9)] sm:[--cell-size:--spacing(10)]"
              />
            </div>

            <div className="grid content-start gap-3 border-t border-border bg-muted/15 p-3 md:border-t-0 md:border-l">
              <div className="grid gap-1">
                <p className="text-sm font-semibold">Set times</p>
                <p className="text-xs text-muted-foreground">
                  Use hour, minute, and AM or PM.
                </p>
              </div>
              <TimeSelector
                id="trip-start-time"
                label="Start time"
                date={startDate}
                disabled={!startDate}
                hasError={Boolean(startError)}
                onChange={updateStartTime}
              />
              <TimeSelector
                id="trip-end-time"
                label="End time"
                date={endDate}
                disabled={!endDate}
                hasError={Boolean(endError)}
                onChange={updateEndTime}
              />
              <Button
                type="button"
                className="mt-auto w-full"
                disabled={!startDate || !endDate}
                onClick={() => setOpen(false)}
              >
                Apply date and time
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-sm text-muted-foreground">
        Select the date range and choose AM or PM for both times.
      </p>
      {startError ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {startError}
        </p>
      ) : null}
      {endError ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {endError}
        </p>
      ) : null}
    </div>
  );
}
