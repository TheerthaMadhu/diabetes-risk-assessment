import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Activity, ShieldCheck, LineChart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DiabetesRisk — AI-powered diabetes risk assessment" },
      {
        name: "description",
        content:
          "Estimate your diabetes risk in seconds with a machine learning model trained on the Pima Indians Diabetes dataset.",
      },
      { property: "og:title", content: "DiabetesRisk — AI-powered diabetes risk assessment" },
      {
        property: "og:description",
        content: "Estimate your diabetes risk in seconds using a clinically-grounded ML model.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/40 to-background">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Machine Learning · Healthcare
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Know your diabetes risk in seconds
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Enter eight standard health metrics and get an instant, evidence-based risk estimate powered by a
              logistic regression model trained on the Pima Indians Diabetes dataset.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/assessment">Take the assessment</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Clinically grounded",
              body: "Built on the well-known Pima Indians dataset and standard logistic regression — transparent and reproducible.",
            },
            {
              icon: LineChart,
              title: "Instant results",
              body: "Predictions run in your browser. No waiting, no data leaves your device unless you choose to save it.",
            },
            {
              icon: Lock,
              title: "Private history",
              body: "Create an account to securely save assessments and track changes over time.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
