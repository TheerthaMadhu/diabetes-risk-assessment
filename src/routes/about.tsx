import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the model — DiabetesRisk" },
      {
        name: "description",
        content:
          "Learn how DiabetesRisk works: the Pima Indians Diabetes dataset, logistic regression model, and accuracy.",
      },
      { property: "og:title", content: "About the model — DiabetesRisk" },
      {
        property: "og:description",
        content: "How the diabetes risk model works, what it uses, and its limitations.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-16 prose-neutral">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">About the model</h1>
        <p className="mt-4 text-muted-foreground">
          DiabetesRisk uses a logistic regression classifier trained on the Pima Indians Diabetes dataset — one of the most
          widely cited benchmarks for diabetes risk prediction. Coefficients are shipped as plain numbers, so prediction
          runs entirely in your browser with no server roundtrip.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">Inputs</h2>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Pregnancies</li>
          <li>Plasma glucose (mg/dL)</li>
          <li>Diastolic blood pressure (mm Hg)</li>
          <li>Triceps skin fold thickness (mm)</li>
          <li>2-hour serum insulin (μU/mL)</li>
          <li>Body Mass Index (kg/m²)</li>
          <li>Diabetes pedigree function (genetic score)</li>
          <li>Age (years)</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-foreground">Method</h2>
        <p className="mt-3 text-muted-foreground">
          Inputs are standardized against the dataset's per-feature mean and standard deviation, then combined with trained
          coefficients via a sigmoid function to produce a probability between 0 and 1. We map probability to three bands:
          Low (&lt;30%), Moderate (30–60%), High (&gt;60%).
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">Accuracy & limitations</h2>
        <p className="mt-3 text-muted-foreground">
          Logistic regression on the Pima dataset typically achieves around 77–79% accuracy on held-out data. The dataset is
          historical, US-based, and limited in demographic scope. Treat results as educational, not diagnostic.
        </p>
      </article>
    </SiteLayout>
  );
}
