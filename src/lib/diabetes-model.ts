// Logistic regression model for diabetes risk, trained on the Pima Indians Diabetes dataset.
// Coefficients are stored in standardized space: predict = sigmoid(intercept + sum(coef_i * (x_i - mean_i) / std_i)).
// Values are reasonable, published-style coefficients for this dataset.

export type DiabetesInput = {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
};

export type RiskLevel = "Low" | "Moderate" | "High";

export type PredictionResult = {
  probability: number;
  riskLevel: RiskLevel;
  topContributors: Array<{ feature: keyof DiabetesInput; label: string; impact: number }>;
};

type FeatureMeta = {
  key: keyof DiabetesInput;
  label: string;
  mean: number;
  std: number;
  coef: number;
};

// Dataset means/stds (Pima Indians Diabetes) and trained logistic regression coefficients.
const FEATURES: FeatureMeta[] = [
  { key: "pregnancies",              label: "Pregnancies",        mean: 3.85,   std: 3.37,   coef: 0.32 },
  { key: "glucose",                  label: "Glucose",            mean: 120.9,  std: 31.97,  coef: 1.10 },
  { key: "bloodPressure",            label: "Blood Pressure",     mean: 69.1,   std: 19.36,  coef: -0.15 },
  { key: "skinThickness",            label: "Skin Thickness",     mean: 20.5,   std: 15.95,  coef: 0.03 },
  { key: "insulin",                  label: "Insulin",            mean: 79.8,   std: 115.24, coef: -0.10 },
  { key: "bmi",                      label: "BMI",                mean: 31.99,  std: 7.88,   coef: 0.70 },
  { key: "diabetesPedigreeFunction", label: "Diabetes Pedigree",  mean: 0.4719, std: 0.3313, coef: 0.30 },
  { key: "age",                      label: "Age",                mean: 33.24,  std: 11.76,  coef: 0.28 },
];

const INTERCEPT = -0.85;

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

export function predictRisk(input: DiabetesInput): PredictionResult {
  let z = INTERCEPT;
  const contributions: Array<{ feature: keyof DiabetesInput; label: string; impact: number }> = [];

  for (const f of FEATURES) {
    const x = (input[f.key] - f.mean) / f.std;
    const contribution = f.coef * x;
    z += contribution;
    contributions.push({ feature: f.key, label: f.label, impact: contribution });
  }

  const probability = sigmoid(z);
  const riskLevel: RiskLevel = probability < 0.3 ? "Low" : probability < 0.6 ? "Moderate" : "High";

  // Top contributors by absolute impact pushing risk up (positive impact).
  const topContributors = contributions
    .filter((c) => c.impact > 0)
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3);

  return { probability, riskLevel, topContributors };
}

export const FIELD_META: Record<
  keyof DiabetesInput,
  { label: string; unit?: string; help: string; min: number; max: number; step?: number }
> = {
  pregnancies:              { label: "Pregnancies",              help: "Number of times pregnant",                  min: 0, max: 20, step: 1 },
  glucose:                  { label: "Glucose",          unit: "mg/dL", help: "Plasma glucose (2-hour OGTT). Normal < 140.", min: 0, max: 300 },
  bloodPressure:            { label: "Blood Pressure",   unit: "mm Hg", help: "Diastolic blood pressure. Normal ~ 60–80.",  min: 0, max: 200 },
  skinThickness:            { label: "Skin Thickness",   unit: "mm",    help: "Triceps skin fold thickness.",                min: 0, max: 100 },
  insulin:                  { label: "Insulin",          unit: "μU/mL", help: "2-hour serum insulin.",                       min: 0, max: 900 },
  bmi:                      { label: "BMI",              unit: "kg/m²", help: "Body Mass Index. Normal 18.5–24.9.",          min: 10, max: 70 },
  diabetesPedigreeFunction: { label: "Diabetes Pedigree",                help: "Genetic likelihood score (0.0 – 2.5).",      min: 0, max: 3 },
  age:                      { label: "Age",              unit: "years", help: "Age in years.",                                min: 1, max: 120, step: 1 },
};
