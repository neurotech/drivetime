"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Trip } from "@/db/schema";
import type { TripFormData } from "@/lib/validators";
import { TripForm } from "./trip-form";

interface TripDialogProps {
  trip?: Trip;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function TripDialog({ trip, trigger, onSuccess }: TripDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestEndKilometres, setLatestEndKilometres] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (open && !trip) {
      fetch("/api/trips?sortBy=createdAt&sortOrder=desc")
        .then((res) => res.json())
        .then((data: Trip[]) => {
          if (data.length > 0) {
            setLatestEndKilometres(data[0].endKilometres);
          }
        })
        .catch(() => {
          // Silently fail - just don't pre-populate
        });
    }
  }, [open, trip]);

  const handleSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);
    try {
      const url = trip ? `/api/trips/${trip.id}` : "/api/trips";
      const method = trip ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save trip");
      }

      toast.success(
        trip ? "Trip updated successfully" : "Trip added successfully",
      );
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-125"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{trip ? "Edit Trip" : "Add New Trip"}</DialogTitle>
        </DialogHeader>
        <TripForm
          trip={trip}
          defaultStartKilometres={latestEndKilometres}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
