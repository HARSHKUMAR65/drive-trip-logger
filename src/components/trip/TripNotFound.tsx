import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TripNotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
        <MapPinOff className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">
        Trip not found
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This trip may have been deleted or is no longer available to edit.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">
          <ArrowLeft aria-hidden="true" />
          Back to trips
        </Link>
      </Button>
    </main>
  );
}
