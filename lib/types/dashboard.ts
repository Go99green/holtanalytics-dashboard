export type ScenarioName = "Baseline" | "Tactical" | "Aggressive";

export const SCENARIO_NAMES: readonly ScenarioName[] = [
  "Baseline",
  "Tactical",
  "Aggressive",
] as const;

export const MODEL_YEARS = [
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
] as const;

export type ModelYear = (typeof MODEL_YEARS)[number];

export type MetricClass =
  | "historical_public_anchor"
  | "modeled_estimate"
  | "derived"
  | "control"
  | "projection"
  | "context"
  | "unknown";

export type NormalizedStatus =
  | "public"
  | "public_projection"
  | "estimate"
  | "estimate_projection"
  | "derived"
  | "control"
  | "context"
  | "unknown";

export type Confidence = "High" | "Medium" | "Low" | "Unknown";

export type WorkbookPriority = 1 | 2 | 3;

export interface WorkbookIdentity {
  key: "primary" | "secondary" | "tertiary";
  fileName: string;
  priority: WorkbookPriority;
}

export interface DataPointByYear {
  [year: string]: number | string | null;
}

export interface SourceRef {
  method?: string;
  url?: string;
  workbook: string;
  sheet: string;
}

export interface MasterModelMetric {
  id: string;
  group: string;
  fieldKey: string;
  fieldLabel: string;
  unit: string;
  valuesByYear: DataPointByYear;
  rawStatus: string;
  normalizedStatus: NormalizedStatus;
  metricClass: MetricClass;
  confidence: Confidence;
  source: SourceRef;
  notes?: string;
}

export interface AssumptionRecord {
  category: string;
  driver: string;
  fieldKey: string;
  valuesByYear: DataPointByYear;
  unit?: string;
  rawStatus: string;
  normalizedStatus: NormalizedStatus;
  metricClass: MetricClass;
  sourceMethod?: string;
}

export interface ScenarioLeverRecord {
  leverKey: string;
  leverLabel: string;
  valuesByScenario: Record<ScenarioName, number | null>;
}

export interface ScenarioProjectionRecord {
  metricKey: string;
  metricLabel: string;
  valuesByScenario: Record<ScenarioName, number | null>;
}

export interface WorkbookConflict {
  sheet: string;
  fieldKey: string;
  years: string[];
  primaryValue: number | string | null;
  conflictingWorkbook: string;
  conflictingValue: number | string | null;
  note: string;
}

export interface NormalizedWorkbookArtifacts {
  metadata: {
    generatedAt: string;
    selectedWorkbook: WorkbookIdentity;
    consideredWorkbooks: WorkbookIdentity[];
    formulaReadLimitation: string;
  };
  masterModel: MasterModelMetric[];
  assumptions: AssumptionRecord[];
  scenarioLevers: ScenarioLeverRecord[];
  scenarioProjections: ScenarioProjectionRecord[];
  conflicts: WorkbookConflict[];
}

export interface HistoricalAnchor {
  year: Exclude<ModelYear, "2026-27">;
  metrics: Record<string, number | string | null>;
}

export interface ModeledMetricSeries {
  fieldKey: string;
  fieldLabel: string;
  valuesByYear: DataPointByYear;
}

export interface DashboardScenarioConfig {
  name: ScenarioName;
  growth: Record<string, number>;
}
