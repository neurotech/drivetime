"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Trip } from "@/db/schema";

interface UseFetchTripsOptions {
  search?: string;
  sortBy?: "createdAt" | "startLocation" | "endLocation";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export function useFetchTrips(options: UseFetchTripsOptions = {}) {
  const {
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    limit,
  } = options;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search, sortBy, sortOrder });
      if (limit) {
        params.set("limit", String(limit));
      }
      const response = await fetch(`/api/trips?${params}`);
      if (!response.ok) {
        throw new Error("Failed to load trips");
      }
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load trips";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [search, sortBy, sortOrder, limit]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips };
}
