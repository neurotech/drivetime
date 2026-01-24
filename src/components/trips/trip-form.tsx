"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { LocationInput } from "@/components/trips/location-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Trip } from "@/db/schema";
import { type TripFormData, tripSchema } from "@/lib/validators";

interface TripFormProps {
  trip?: Trip;
  defaultStartKilometres?: number;
  onSubmit: (data: TripFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TripForm({
  trip,
  defaultStartKilometres,
  onSubmit,
  onCancel,
  isSubmitting,
}: TripFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: trip
      ? {
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
          startKilometres: trip.startKilometres,
          endKilometres: trip.endKilometres,
          notes: trip.notes || "",
        }
      : {
          startLocation: "",
          endLocation: "",
          startKilometres: defaultStartKilometres ?? 0,
          endKilometres: defaultStartKilometres ?? 0,
          notes: "",
        },
  });

  // Update form when defaultStartKilometres is loaded asynchronously
  React.useEffect(() => {
    if (!trip && defaultStartKilometres !== undefined) {
      reset({
        startLocation: "",
        endLocation: "",
        startKilometres: defaultStartKilometres,
        endKilometres: defaultStartKilometres,
        notes: "",
      });
    }
  }, [defaultStartKilometres, trip, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startLocation">Start Location</Label>
          <LocationInput
            id="startLocation"
            placeholder="e.g., Home"
            aria-invalid={!!errors.startLocation}
            aria-describedby={
              errors.startLocation ? "startLocation-error" : undefined
            }
            {...register("startLocation")}
            onLocationSelect={(location) => setValue("startLocation", location)}
          />
          {errors.startLocation && (
            <p id="startLocation-error" className="text-sm text-destructive">
              {errors.startLocation.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endLocation">End Location</Label>
          <LocationInput
            id="endLocation"
            placeholder="e.g., Office"
            aria-invalid={!!errors.endLocation}
            aria-describedby={
              errors.endLocation ? "endLocation-error" : undefined
            }
            {...register("endLocation")}
            onLocationSelect={(location) => setValue("endLocation", location)}
          />
          {errors.endLocation && (
            <p id="endLocation-error" className="text-sm text-destructive">
              {errors.endLocation.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startKilometres">Start Kilometres</Label>
          <Input
            id="startKilometres"
            type="number"
            step="1"
            aria-invalid={!!errors.startKilometres}
            aria-describedby={
              errors.startKilometres ? "startKilometres-error" : undefined
            }
            {...register("startKilometres", { valueAsNumber: true })}
          />
          {errors.startKilometres && (
            <p id="startKilometres-error" className="text-sm text-destructive">
              {errors.startKilometres.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endKilometres">End Kilometres</Label>
          <Input
            id="endKilometres"
            type="number"
            step="1"
            aria-invalid={!!errors.endKilometres}
            aria-describedby={
              errors.endKilometres ? "endKilometres-error" : undefined
            }
            {...register("endKilometres", { valueAsNumber: true })}
          />
          {errors.endKilometres && (
            <p id="endKilometres-error" className="text-sm text-destructive">
              {errors.endKilometres.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this trip..."
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          {...register("notes")}
        />
        {errors.notes && (
          <p id="notes-error" className="text-sm text-destructive">
            {errors.notes.message}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : trip ? "Update Trip" : "Add Trip"}
        </Button>
      </div>
    </form>
  );
}
