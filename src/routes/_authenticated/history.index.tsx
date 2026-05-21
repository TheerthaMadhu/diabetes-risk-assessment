import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { listAssessments } from "@/lib/assessments.functions";

export const Route = createFileRoute("/_authenticated/history/")({
  head: () => ({
    meta: [
      { title: "Your history — DiabetesRisk" },
      { name: "description", content: "Your saved diabetes risk assessments." },
    ],
  }),
  component: HistoryPage,
});

const RISK_BADGE: Record<string, string> = {
  Low: "bg-risk-low text-risk-low-foreground",
  Moderate: "bg-risk-moderate text-risk-moderate-foreground",
  High: "bg-risk-high text-risk-high-foreground",
};

function HistoryPage() {
  const list = useServerFn(listAssessments);
  const { data, isLoading, error } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => list(),
  });

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Your history</h1>
          <Button asChild>
            <Link to="/assessment">New assessment</Link>
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {error && <p className="text-destructive">Couldn't load history.</p>}
        {data && data.assessments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No assessments yet.{" "}
            <Link to="/assessment" className="text-primary hover:underline">
              Take your first one
            </Link>
            .
          </div>
        )}

        {data && data.assessments.length > 0 && (
          <ul className="space-y-3">
            {data.assessments.map((a) => (
              <li key={a.id}>
                <Link
                  to="/history/$id"
                  params={{ id: a.id }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(a.created_at), "PPP · p")}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {Math.round(Number(a.probability) * 100)}% probability
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${RISK_BADGE[a.risk_level] ?? ""}`}
                  >
                    {a.risk_level}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
