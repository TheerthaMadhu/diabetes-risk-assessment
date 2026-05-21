import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { AssessmentResult } from "@/components/AssessmentResult";
import { deleteAssessment, getAssessment } from "@/lib/assessments.functions";
import { FIELD_META, type DiabetesInput, type RiskLevel } from "@/lib/diabetes-model";

export const Route = createFileRoute("/_authenticated/history/$id")({
  head: () => ({
    meta: [
      { title: "Assessment detail — DiabetesRisk" },
      { name: "description", content: "Details of a saved diabetes risk assessment." },
    ],
  }),
  component: HistoryDetail,
});

function HistoryDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const get = useServerFn(getAssessment);
  const del = useServerFn(deleteAssessment);

  const { data, isLoading, error } = useQuery({
    queryKey: ["assessments", id],
    queryFn: () => get({ data: { id } }),
  });

  const delMutation = useMutation({
    mutationFn: () => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Deleted");
      navigate({ to: "/history" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to history
        </Link>

        {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
        {error && <p className="mt-6 text-destructive">Couldn't load assessment.</p>}

        {data?.assessment && (
          <>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              {format(new Date(data.assessment.created_at), "PPP · p")}
            </h1>

            <div className="mt-6">
              <AssessmentResult
                result={{
                  probability: Number(data.assessment.probability),
                  riskLevel: data.assessment.risk_level as RiskLevel,
                  topContributors: [],
                }}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Inputs</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(data.assessment.inputs as DiabetesInput).map(([k, v]) => {
                  const meta = FIELD_META[k as keyof DiabetesInput];
                  return (
                    <div key={k} className="flex items-baseline justify-between border-b border-border/50 pb-2">
                      <dt className="text-sm text-muted-foreground">
                        {meta?.label ?? k}
                        {meta?.unit ? <span className="ml-1 text-xs">({meta.unit})</span> : null}
                      </dt>
                      <dd className="font-mono text-sm text-foreground">{String(v)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/assessment">New assessment</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => delMutation.mutate()}
                disabled={delMutation.isPending}
              >
                {delMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
