"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { TripDialog } from "@/components/trips/trip-dialog";
import { TripFilters } from "@/components/trips/trip-filters";
import { TripList } from "@/components/trips/trip-list";
import { TripListSkeleton } from "@/components/trips/trip-list-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchTrips } from "@/lib/hooks/use-fetch-trips";

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "startLocation" | "endLocation"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { trips, isLoading, refetch } = useFetchTrips({
    search,
    sortBy,
    sortOrder,
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Trips</CardTitle>
              <TripFilters
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TripListSkeleton count={5} height="h-10" />
            ) : (
              <TripList trips={trips} onRefresh={refetch} />
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="container mx-auto">
          <TripDialog
            onSuccess={refetch}
            trigger={
              <Button size="xl" className="w-full">
                Add Trip
              </Button>
            }
          />
        </div>
      </footer>
    </div>
  );
}
