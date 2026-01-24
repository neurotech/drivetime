import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Trip } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTripDistance(trip: Trip): number {
  return trip.endKilometres - trip.startKilometres;
}

export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)} km`;
}
