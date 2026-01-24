"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Trip } from "@/db/schema";
import { calculateTripDistance, formatDistance } from "@/lib/utils";
import { TripTableRowActions } from "./trip-table-row-actions";

interface TripCardProps {
  trip: Trip;
  onRefresh?: () => void;
}

export function TripCard({ trip, onRefresh }: TripCardProps) {
  const distance = calculateTripDistance(trip);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {format(new Date(trip.createdAt), "MMM d, yyyy")}
          </p>
          <h3 className="font-semibold leading-none">
            {trip.startLocation} → {trip.endLocation}
          </h3>
        </div>
        <TripTableRowActions trip={trip} onRefresh={onRefresh} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatDistance(distance)}</span>
          {trip.notes && (
            <span
              className="text-sm text-muted-foreground truncate max-w-[150px]"
              title={trip.notes}
            >
              {trip.notes}
            </span>
          )}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {trip.startKilometres.toFixed(1)} → {trip.endKilometres.toFixed(1)} km
        </div>
      </CardContent>
    </Card>
  );
}
