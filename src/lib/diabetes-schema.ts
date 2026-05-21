import { z } from "zod";

export const diabetesInputSchema = z.object({
  pregnancies: z.coerce.number().min(0).max(20),
  glucose: z.coerce.number().min(0).max(300),
  bloodPressure: z.coerce.number().min(0).max(200),
  skinThickness: z.coerce.number().min(0).max(100),
  insulin: z.coerce.number().min(0).max(900),
  bmi: z.coerce.number().min(10).max(70),
  diabetesPedigreeFunction: z.coerce.number().min(0).max(3),
  age: z.coerce.number().int().min(1).max(120),
});

export type DiabetesInputForm = z.infer<typeof diabetesInputSchema>;
