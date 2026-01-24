import { asc, desc, like, or } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { trips } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { tripSchema } from "@/lib/validators";

const sortableColumns = {
  createdAt: trips.createdAt,
  startLocation: trips.startLocation,
  endLocation: trips.endLocation,
  startKilometres: trips.startKilometres,
  endKilometres: trips.endKilometres,
} as const;

type SortableColumn = keyof typeof sortableColumns;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const column: SortableColumn =
    sortBy in sortableColumns ? (sortBy as SortableColumn) : "createdAt";

  let query = db.select().from(trips);

  if (search) {
    query = query.where(
      or(
        like(trips.startLocation, `%${search}%`),
        like(trips.endLocation, `%${search}%`),
        like(trips.notes, `%${search}%`),
      ),
    ) as typeof query;
  }

  const sortColumn = sortableColumns[column];
  query = query.orderBy(
    sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
  ) as typeof query;

  query = query.limit(limit).offset(offset) as typeof query;

  const results = await query;
  return successResponse(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = tripSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", 400, parsed.error.flatten());
  }

  const [newTrip] = await db.insert(trips).values(parsed.data).returning();
  return successResponse(newTrip, 201);
}
