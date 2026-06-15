"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">
        We could not load your trips
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Check the database connection and try again. Your saved trip data has
        not been changed.
      </p>
      <Button className="mt-6" onClick={reset}>
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
    </main>
  );
}
