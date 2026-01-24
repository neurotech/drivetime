"use client";

import { ArrowRight, Car } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { TripDialog } from "@/components/trips/trip-dialog";
import { TripList } from "@/components/trips/trip-list";
import { TripListSkeleton } from "@/components/trips/trip-list-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTrips } from "@/lib/hooks/use-fetch-trips";
import { calculateTripDistance, formatDistance } from "@/lib/utils";

export default function DashboardPage() {
  const {
    trips: recentTrips,
    isLoading,
    refetch,
  } = useFetchTrips({ limit: 5 });

  const totalDistance = recentTrips.reduce(
    (sum, trip) => sum + calculateTripDistance(trip),
    0,
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-4 gap-4 flex flex-col">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/trips">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TripListSkeleton count={3} />
            ) : (
              <TripList trips={recentTrips} onRefresh={refetch} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{recentTrips.length}</div>
            )}
            <p className="text-xs text-muted-foreground">Recent trips shown</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Distance (Recent)
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatDistance(totalDistance)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">From recent trips</p>
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
