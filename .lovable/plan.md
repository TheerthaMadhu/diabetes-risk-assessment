# Diabetes Risk Assessment — Build Plan

A healthcare-themed web app that predicts diabetes risk from 8 medical inputs, with user accounts and saved assessment history. Built on the existing TanStack Start stack (no Python required) using pre-trained logistic regression coefficients ported to TypeScript.

## Pages / Routes

- `/` — Landing page. Hero, what-it-does, disclaimer, CTAs to "Take Assessment" and "Sign in".
- `/assessment` — The 8-field health form + instant result. Works for guests; signed-in users get the result auto-saved.
- `/login` — Email/password + Google sign-in.
- `/_authenticated/history` — List of past assessments (date, risk level, score, key inputs).
- `/_authenticated/history/$id` — Detail view of one assessment.
- `/about` — How the model works, dataset (Pima Indians), accuracy, medical disclaimer.

Shared header with nav (Home / Assessment / History / About / Sign in or user menu) and footer with disclaimer.

## Prediction logic

A pure TypeScript module `src/lib/diabetes-model.ts`:
- Pre-trained logistic regression coefficients + intercept derived from the Pima Indians Diabetes dataset (standard, well-published values), with per-feature mean/std for input normalization.
- `predictRisk(input)` returns `{ probability: 0–1, riskLevel: "Low" | "Moderate" | "High", topContributors: [...] }`.
- Thresholds: <0.3 Low, 0.3–0.6 Moderate, >0.6 High.
- Input validation via Zod: ranges per field (e.g. glucose 0–300, age 1–120, BMI 10–70), no negatives, required.

This runs entirely in the browser — instant results, no backend call for the prediction itself.

## Form fields (all numeric)

Pregnancies, Glucose (mg/dL), Blood Pressure (mm Hg), Skin Thickness (mm), Insulin (μU/mL), BMI, Diabetes Pedigree Function, Age. Each with label, helper text explaining the unit/normal range, and inline validation errors.

## Result display

- Big risk badge (Low/Moderate/High) with color-coded card (green/amber/red within the medical palette).
- Probability percentage + simple gauge bar.
- "Top contributing factors" list (the 3 features with the largest standardized weight × value).
- Medical disclaimer.
- Buttons: "Retake", "Save to history" (if signed in — otherwise prompt to sign in to save).

## Backend (Lovable Cloud)

Enable Lovable Cloud for auth + history.

Auth: email/password + Google (via Lovable broker).

Database:
- `profiles` — id (FK auth.users), display_name, created_at. Auto-created on signup via trigger.
- `assessments` — id, user_id (FK), inputs jsonb (all 8 fields), probability numeric, risk_level text, created_at. RLS: users can only select/insert/delete their own rows.

Server functions (`src/lib/assessments.functions.ts`, protected by `requireSupabaseAuth`):
- `saveAssessment({ inputs, probability, riskLevel })`
- `listAssessments()` → for `/history` loader
- `getAssessment({ id })` → for `/history/$id` loader
- `deleteAssessment({ id })`

Wired through TanStack Query (`ensureQueryData` + `useSuspenseQuery`), with `attachSupabaseAuth` already in `src/start.ts` (verify).

## Design (Clean medical, blue/white)

Tokens added to `src/styles.css` (all `oklch`):
- Primary: medical blue (~#2563eb equivalent).
- Background: white / very light blue-tint.
- Accents: soft green (low risk), amber (moderate), red (high).
- Cards with rounded-xl, subtle shadow, generous spacing.
- Inter or system sans-serif, clear hierarchy.
- Fully responsive (mobile-first), accessible labels.

## SEO

Per-route `head()` with unique title + description + og tags. Single H1 per page. Semantic HTML. Medical disclaimer present.

## Out of scope (per blueprint's "future enhancements")

PDF reports, doctor recommendations, deep learning, real-time analytics — not in v1.

## Technical notes

- No Python/Flask — this stack is TanStack Start (React + TS on Cloudflare Workers). The trained logistic regression is shipped as constants in TS, mathematically equivalent to a scikit-learn `LogisticRegression` fit on Pima data.
- Predictions are client-side and free; only saving history hits the database.
- All inputs validated client-side (Zod) before prediction; server-side again before insert.
