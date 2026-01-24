"use client";

import { Car } from "lucide-react";
import type { Trip } from "@/db/schema";
import { TripCard } from "./trip-card";
import { TripTable } from "./trip-table";

interface TripListProps {
  trips: Trip[];
  onRefresh?: () => void;
}

export function TripList({ trips, onRefresh }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Car className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No trips recorded yet.</p>
        <p className="text-sm text-muted-foreground">
          Add your first trip to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - cards */}
      <div className="grid gap-4 sm:hidden">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onRefresh={onRefresh} />
        ))}
      </div>
      {/* Desktop view - table */}
      <div className="hidden sm:block">
        <TripTable trips={trips} onRefresh={onRefresh} />
      </div>
    </>
  );
}
