import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { tripSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const tripId = Number.parseInt(id, 10);

  if (Number.isNaN(tripId)) {
    return errorResponse("Invalid ID", 400);
  }

  const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));

  if (!trip) {
    return errorResponse("Trip not found", 404);
  }

  return successResponse(trip);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const tripId = Number.parseInt(id, 10);

  if (Number.isNaN(tripId)) {
    return errorResponse("Invalid ID", 400);
  }

  const body = await request.json();
  const parsed = tripSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", 400, parsed.error.flatten());
  }

  const [existingTrip] = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId));

  if (!existingTrip) {
    return errorResponse("Trip not found", 404);
  }

  const [updatedTrip] = await db
    .update(trips)
    .set(parsed.data)
    .where(eq(trips.id, tripId))
    .returning();

  return successResponse(updatedTrip);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const tripId = Number.parseInt(id, 10);

  if (Number.isNaN(tripId)) {
    return errorResponse("Invalid ID", 400);
  }

  const [existingTrip] = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId));

  if (!existingTrip) {
    return errorResponse("Trip not found", 404);
  }

  await db.delete(trips).where(eq(trips.id, tripId));

  return successResponse({ success: true });
}
