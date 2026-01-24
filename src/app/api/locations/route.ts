import { NextResponse } from "next/server";
import { db } from "@/db";
import { trips } from "@/db/schema";

export async function GET() {
  // Get all locations from both columns with their frequencies
  const startLocations = db
    .select({
      location: trips.startLocation,
    })
    .from(trips);

  const endLocations = db
    .select({
      location: trips.endLocation,
    })
    .from(trips);

  // Execute both queries
  const [starts, ends] = await Promise.all([startLocations, endLocations]);

  // Combine and count frequencies
  const locationCounts = new Map<string, number>();

  for (const { location } of [...starts, ...ends]) {
    const trimmed = location.trim();
    if (trimmed) {
      locationCounts.set(trimmed, (locationCounts.get(trimmed) || 0) + 1);
    }
  }

  // Sort by frequency and take top 5
  const topLocations = Array.from(locationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([location]) => location);

  return NextResponse.json({ locations: topLocations });
}
