"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Trip } from "@/db/schema";
import { calculateTripDistance, formatDistance } from "@/lib/utils";
import { TripTableRowActions } from "./trip-table-row-actions";

export const columns: ColumnDef<Trip>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "MMM d, yyyy");
    },
  },
  {
    accessorKey: "startLocation",
    header: "Start",
  },
  {
    accessorKey: "endLocation",
    header: "End",
  },
  {
    id: "distance",
    header: "Distance",
    cell: ({ row }) => formatDistance(calculateTripDistance(row.original)),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | null;
      if (!notes) return <span className="text-muted-foreground">-</span>;
      return (
        <span className="max-w-[200px] truncate block" title={notes}>
          {notes}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const onRefresh = (table.options.meta as { onRefresh?: () => void })
        ?.onRefresh;
      return <TripTableRowActions trip={row.original} onRefresh={onRefresh} />;
    },
  },
];
