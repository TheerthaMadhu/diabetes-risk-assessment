import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { diabetesInputSchema } from "./diabetes-schema";

const saveSchema = z.object({
  inputs: diabetesInputSchema,
  probability: z.number().min(0).max(1),
  riskLevel: z.enum(["Low", "Moderate", "High"]),
});

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        inputs: data.inputs,
        probability: data.probability,
        risk_level: data.riskLevel,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const listAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("assessments")
      .select("id, probability, risk_level, created_at, inputs")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { assessments: data ?? [] };
  });

export const getAssessment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase
      .from("assessments")
      .select("id, probability, risk_level, created_at, inputs")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return { assessment: row };
  });

export const deleteAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("assessments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
