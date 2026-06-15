"use client";

import { useOptimistic, useTransition } from "react";
import { LoaderCircle, Star } from "lucide-react";
import { toast } from "sonner";

import { toggleMemorableAction } from "@/actions/trip.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MemorableToggleProps {
  tripPublicId: string;
  memorable: boolean;
  onChanged?: () => void;
}

export function MemorableToggle({
  tripPublicId,
  memorable,
  onChanged,
}: MemorableToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticMemorable, setOptimisticMemorable] =
    useOptimistic(memorable);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    startTransition(async () => {
      setOptimisticMemorable(!optimisticMemorable);
      const result = await toggleMemorableAction(tripPublicId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onChanged?.();
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(
        "rounded-full text-muted-foreground hover:text-amber-700",
        optimisticMemorable &&
          "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700",
      )}
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={optimisticMemorable}
      aria-label={
        optimisticMemorable
          ? "Remove from memorable trips"
          : "Mark as memorable"
      }
      title={
        optimisticMemorable
          ? "Remove from memorable trips"
          : "Mark as memorable"
      }
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <Star
          className={cn(optimisticMemorable && "fill-current")}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
