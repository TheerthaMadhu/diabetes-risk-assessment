import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/SiteLayout";
import { AssessmentResult } from "@/components/AssessmentResult";
import { diabetesInputSchema, type DiabetesInputForm } from "@/lib/diabetes-schema";
import { FIELD_META, predictRisk, type PredictionResult } from "@/lib/diabetes-model";
import { saveAssessment } from "@/lib/assessments.functions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Diabetes risk assessment — DiabetesRisk" },
      { name: "description", content: "Enter your health metrics and get an instant diabetes risk estimate." },
      { property: "og:title", content: "Diabetes risk assessment — DiabetesRisk" },
      { property: "og:description", content: "Instant ML-based diabetes risk estimate from 8 health metrics." },
    ],
  }),
  component: AssessmentPage,
});

const FIELD_ORDER: (keyof DiabetesInputForm)[] = [
  "pregnancies",
  "glucose",
  "bloodPressure",
  "skinThickness",
  "insulin",
  "bmi",
  "diabetesPedigreeFunction",
  "age",
];

function AssessmentPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const save = useServerFn(saveAssessment);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [lastInputs, setLastInputs] = useState<DiabetesInputForm | null>(null);

  const form = useForm<DiabetesInputForm>({
    resolver: zodResolver(diabetesInputSchema),
    defaultValues: {
      pregnancies: 0,
      glucose: 120,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 80,
      bmi: 25,
      diabetesPedigreeFunction: 0.5,
      age: 30,
    },
  });

  const saveMutation = useMutation({
    mutationFn: (vars: { inputs: DiabetesInputForm; probability: number; riskLevel: PredictionResult["riskLevel"] }) =>
      save({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Saved to your history");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (values: DiabetesInputForm) => {
    const r = predictRisk(values);
    setResult(r);
    setLastInputs(values);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Diabetes risk assessment</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your health metrics below. All calculations run in your browser.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELD_ORDER.map((key) => {
                const meta = FIELD_META[key];
                const err = form.formState.errors[key];
                return (
                  <div key={key}>
                    <Label htmlFor={key}>
                      {meta.label}
                      {meta.unit ? <span className="ml-1 text-xs text-muted-foreground">({meta.unit})</span> : null}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      step={meta.step ?? "any"}
                      min={meta.min}
                      max={meta.max}
                      {...form.register(key, { valueAsNumber: true })}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{meta.help}</p>
                    {err && <p className="mt-1 text-xs text-destructive">{err.message as string}</p>}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg">
                Predict risk
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  form.reset();
                  setResult(null);
                  setLastInputs(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>

          <aside className="space-y-4">
            {result && lastInputs ? (
              <>
                <AssessmentResult result={result} />
                {user ? (
                  <Button
                    className="w-full"
                    disabled={saveMutation.isPending}
                    onClick={() =>
                      saveMutation.mutate({
                        inputs: lastInputs,
                        probability: result.probability,
                        riskLevel: result.riskLevel,
                      })
                    }
                  >
                    {saveMutation.isPending ? "Saving…" : "Save to history"}
                  </Button>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
                    <Link to="/login" className="font-medium text-primary hover:underline">
                      Sign in
                    </Link>{" "}
                    to save this result to your history.
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Your result will appear here after you submit the form.
              </div>
            )}
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
