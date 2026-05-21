import type { PredictionResult } from "@/lib/diabetes-model";
import { cn } from "@/lib/utils";

const RISK_STYLES: Record<PredictionResult["riskLevel"], string> = {
  Low: "bg-risk-low text-risk-low-foreground",
  Moderate: "bg-risk-moderate text-risk-moderate-foreground",
  High: "bg-risk-high text-risk-high-foreground",
};

const RISK_DESC: Record<PredictionResult["riskLevel"], string> = {
  Low: "Your estimated risk is low. Keep up healthy habits.",
  Moderate: "Your estimated risk is moderate. Consider discussing prevention with your doctor.",
  High: "Your estimated risk is high. Please consult a healthcare professional.",
};

export function AssessmentResult({ result }: { result: PredictionResult }) {
  const pct = Math.round(result.probability * 100);
  return (
    <div className="space-y-6">
      <div className={cn("rounded-2xl p-6 shadow-sm", RISK_STYLES[result.riskLevel])}>
        <p className="text-sm font-medium opacity-90">Diabetes risk</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">{result.riskLevel}</p>
        <p className="mt-3 text-sm opacity-95">{RISK_DESC[result.riskLevel]}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-muted-foreground">Estimated probability</p>
          <p className="text-2xl font-semibold text-foreground">{pct}%</p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
      </div>

      {result.topContributors.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground">Top contributing factors</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.topContributors.map((c) => (
              <li key={c.feature} className="flex items-center justify-between">
                <span>{c.label}</span>
                <span className="font-mono text-xs text-foreground">+{c.impact.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Standardized weight × value. Higher means a stronger push toward "at risk".
          </p>
        </div>
      )}
    </div>
  );
}
