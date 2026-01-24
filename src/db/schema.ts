import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const trips = sqliteTable(
  "trips",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    startLocation: text("start_location").notNull(),
    endLocation: text("end_location").notNull(),
    startKilometres: real("start_kilometres").notNull(),
    endKilometres: real("end_kilometres").notNull(),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("trips_created_at_idx").on(table.createdAt),
    index("trips_start_location_idx").on(table.startLocation),
  ],
);

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
