import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginatedTrips } from "@/types/trip";

interface TripPaginationProps {
  pagination: PaginatedTrips;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function TripPagination({
  pagination,
  pageSize,
  isLoading,
  onPageChange,
}: TripPaginationProps) {
  const { currentPage, totalCount, totalPages } = pagination;

  if (totalCount === 0) {
    return null;
  }

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <nav
      className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Trip list pagination"
    >
      <p className="text-sm text-muted-foreground">
        Showing {firstItem}-{lastItem} of {totalCount}
      </p>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
