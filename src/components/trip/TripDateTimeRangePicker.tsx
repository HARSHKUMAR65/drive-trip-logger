"use client";

import { useState } from "react";
import {
  format,
  isBefore,
  isSameDay,
  isValid,
  parse,
  startOfDay,
} from "date-fns";
import { CalendarDays, Clock3 } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
const DEPARTURE_FALLBACK_TIME = "09:00";
const ARRIVAL_FALLBACK_TIME = "10:00";

interface TripDateTimeRangePickerProps {
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  startError?: string;
  endError?: string;
}

interface DateInputProps {
  id: string;
  label: string;
  date: Date | undefined;
  placeholder: string;
  disabledDates?: Matcher | Matcher[];
  hasError: boolean;
  onSelect: (date: Date | undefined) => void;
}

interface ScheduleRowProps {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  datePlaceholder: string;
  value: string;
  disabledDates?: Matcher | Matcher[];
  hasError: boolean;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
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

function timeInputValue(value: string): string {
  const date = parseDateTime(value);
  return date ? format(date, "HH:mm") : "";
}

function isBeforeCalendarDay(date: Date, compareDate: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(compareDate));
}

function DateInput({
  id,
  label,
  date,
  placeholder,
  disabledDates,
  hasError,
  onSelect,
}: DateInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <label className="text-xs font-semibold text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-full justify-start px-3 text-left font-normal",
              !date && "text-muted-foreground",
              hasError && "border-destructive",
            )}
            aria-invalid={hasError}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            <span className="truncate">
              {date ? format(date, "PPP") : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className="w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={date}
            disabled={disabledDates}
            onSelect={(nextDate) => {
              onSelect(nextDate);
              setOpen(false);
            }}
            defaultMonth={date}
            captionLayout="dropdown"
            startMonth={new Date(2000, 0)}
            endMonth={new Date(new Date().getFullYear() + 5, 11)}
            className="[--cell-size:--spacing(9)] sm:[--cell-size:--spacing(10)]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ScheduleRow({
  id,
  title,
  description,
  dateLabel,
  timeLabel,
  datePlaceholder,
  value,
  disabledDates,
  hasError,
  onDateChange,
  onTimeChange,
}: ScheduleRowProps) {
  const date = parseDateTime(value);

  return (
    <section
      className={cn(
        "grid gap-3 rounded-xl border border-border bg-muted/20 p-4",
        hasError && "border-destructive/60 bg-destructive/5",
      )}
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
          <Clock3 className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p id={`${id}-heading`} className="text-sm font-semibold">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <DateInput
          id={`${id}-date`}
          label={dateLabel}
          date={date}
          placeholder={datePlaceholder}
          disabledDates={disabledDates}
          hasError={hasError}
          onSelect={onDateChange}
        />
        <div className="grid gap-2">
          <label
            className="text-xs font-semibold text-muted-foreground"
            htmlFor={`${id}-time`}
          >
            {timeLabel}
          </label>
          <div className="relative">
            <Clock3
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id={`${id}-time`}
              type="time"
              value={timeInputValue(value)}
              disabled={!date}
              aria-invalid={hasError}
              className="pl-9"
              onChange={(event) => onTimeChange(event.target.value)}
            />
          </div>
        </div>
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
  const startDate = parseDateTime(startValue);
  const endDate = parseDateTime(endValue);

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) {
      onStartChange("");
      return;
    }

    const nextStart = combineDateAndTime(
      date,
      timePart(startValue, DEPARTURE_FALLBACK_TIME),
    );
    onStartChange(nextStart);

    if (!endDate) {
      onEndChange(combineDateAndTime(date, ARRIVAL_FALLBACK_TIME));
      return;
    }

    const shouldFollowDepartureDate = startDate
      ? isSameDay(startDate, endDate)
      : false;
    const nextEnd =
      shouldFollowDepartureDate || isBeforeCalendarDay(endDate, date)
        ? combineDateAndTime(date, timePart(endValue, ARRIVAL_FALLBACK_TIME))
        : format(endDate, DATE_TIME_FORMAT);

    onEndChange(nextEnd);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      onEndChange("");
      return;
    }

    if (startDate && isBeforeCalendarDay(date, startDate)) {
      return;
    }

    const nextEnd = combineDateAndTime(
      date,
      timePart(endValue, ARRIVAL_FALLBACK_TIME),
    );

    onEndChange(nextEnd);
  };

  const handleStartTimeChange = (time: string) => {
    if (!startDate || !time) {
      return;
    }

    const nextStart = combineDateAndTime(startDate, time);
    onStartChange(nextStart);

    if (endDate) {
      onEndChange(format(endDate, DATE_TIME_FORMAT));
    }
  };

  const handleEndTimeChange = (time: string) => {
    if (endDate && time) {
      onEndChange(combineDateAndTime(endDate, time));
    }
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <p className="text-sm font-semibold">Trip schedule</p>
        <p className="text-sm text-muted-foreground">
          Select the departure date and time, then enter the arrival date and
          time on the next line.
        </p>
      </div>
      <ScheduleRow
        id="trip-departure"
        title="Departure"
        description="Start date and time for the trip."
        dateLabel="Departure date"
        timeLabel="Departure time"
        datePlaceholder="Select departure date"
        value={startValue}
        hasError={Boolean(startError)}
        onDateChange={handleStartDateChange}
        onTimeChange={handleStartTimeChange}
      />
      <ScheduleRow
        id="trip-arrival"
        title="Arrival"
        description="End date and time for the trip."
        dateLabel="Arrival date"
        timeLabel="Arrival time"
        datePlaceholder="Select arrival date"
        value={endValue}
        disabledDates={
          startDate ? { before: startOfDay(startDate) } : undefined
        }
        hasError={Boolean(endError)}
        onDateChange={handleEndDateChange}
        onTimeChange={handleEndTimeChange}
      />
      <p className="text-sm text-muted-foreground">
        Arrival must be later than departure.
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
