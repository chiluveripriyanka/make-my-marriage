import { z } from "zod";
export const weddingSchema = z.object({
  brideName: z.string().trim().min(1, "Enter the bride’s name").max(100),
  groomName: z.string().trim().min(1, "Enter the groom’s name").max(100),
  title: z.string().trim().max(160).default(""),
  weddingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, "Enter a valid date"),
  city: z.string().trim().min(1, "Enter your wedding location").max(200),
});
export type WeddingInput = z.infer<typeof weddingSchema>;
