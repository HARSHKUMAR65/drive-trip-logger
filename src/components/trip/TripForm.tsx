"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createTripAction,
  updateTripAction,
} from "@/actions/trip.actions";
import { TripDateTimeRangePicker } from "@/components/trip/TripDateTimeRangePicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_NOTES_LENGTH,
  tripFormSchema,
  type TripFormValues,
} from "@/schemas/trip.schema";

interface TripFormProps {
  mode: "create" | "edit";
  tripPublicId?: string;
  defaultValues: TripFormValues;
}

export function TripForm({
  mode,
  tripPublicId,
  defaultValues,
}: TripFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues,
    mode: "onBlur",
  });
  const notesLength = form.watch("notes").length;
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const isEditing = mode === "edit";

  const onSubmit = (values: TripFormValues) => {
    setActionError(null);
    startTransition(async () => {
      const result =
        isEditing && tripPublicId
          ? await updateTripAction(tripPublicId, values)
          : await createTripAction(values);

      if (!result.success) {
        setActionError(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/");
      router.refresh();
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/70 bg-card p-6 sm:p-8">
        <CardTitle className="text-2xl tracking-[-0.035em]">
          {isEditing ? "Edit trip details" : "Where did you drive?"}
        </CardTitle>
        <CardDescription className="max-w-xl text-sm leading-6">
          {isEditing
            ? "Update the route, timing, distance, or notes for this drive."
            : "Add the essentials now. You can always refine the details later."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-7"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Rove HQ, Bengaluru"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Nandi Hills"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <input type="hidden" {...form.register("startTime")} />
            <input type="hidden" {...form.register("endTime")} />
            <TripDateTimeRangePicker
              startValue={startTime}
              endValue={endTime}
              onStartChange={(value) =>
                form.setValue("startTime", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              onEndChange={(value) =>
                form.setValue("endTime", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              startError={form.formState.errors.startTime?.message}
              endError={form.formState.errors.endTime?.message}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem className="sm:max-w-[calc(50%-0.625rem)]">
                  <FormLabel>Distance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        className="pr-12"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={Number.isNaN(field.value) ? "" : field.value}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-muted-foreground">
                        km
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the total distance driven.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel>Notes</FormLabel>
                    <span
                      className="text-xs font-medium text-muted-foreground"
                      aria-live="polite"
                    >
                      {notesLength}/{MAX_NOTES_LENGTH}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="What made this drive worth remembering?"
                      maxLength={MAX_NOTES_LENGTH}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Add road conditions, a highlight, or anything you
                    want to recall.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {actionError ? (
              <p
                className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm font-medium text-destructive"
                role="alert"
              >
                {actionError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" />
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="sm:min-w-36"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : isEditing ? (
                  <Save aria-hidden="true" />
                ) : (
                  <Plus aria-hidden="true" />
                )}
                {isPending
                  ? isEditing
                    ? "Saving..."
                    : "Adding..."
                  : isEditing
                    ? "Save changes"
                    : "Add trip"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
