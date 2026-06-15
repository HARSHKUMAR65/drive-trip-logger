import Link from "next/link";
import { Plus, Route } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Drive Trip Logger home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Route className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-bold tracking-[-0.02em]">
              Drive
            </span>
            <span className="block text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              by Rove
            </span>
          </span>
        </Link>
        <Button asChild size="sm">
          <Link href="/trips/new">
            <Plus aria-hidden="true" />
            <span className="hidden sm:inline">Add a trip</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
