import { z } from "zod";

export const tripSchema = z
  .object({
    startLocation: z.string().min(1, "Start location is required"),
    endLocation: z.string().min(1, "End location is required"),
    startKilometres: z.number().gt(0, "Must be greater than 0"),
    endKilometres: z.number().gt(0, "Must be greater than 0"),
    notes: z.string().optional(),
  })
  .refine((data) => data.endKilometres >= data.startKilometres, {
    message: "End kilometres must be greater than or equal to start kilometres",
    path: ["endKilometres"],
  });

export type TripFormData = z.infer<typeof tripSchema>;
