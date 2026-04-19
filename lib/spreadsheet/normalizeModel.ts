import {
  type AssumptionRecord,
  type Confidence,
  MODEL_YEARS,
  type MasterModelMetric,
  type MetricClass,
  type NormalizedStatus,
  SCENARIO_NAMES,
  type ScenarioLeverRecord,
  type ScenarioProjectionRecord,
} from "@/lib/types/dashboard";
import type { RawWorkbook, RawWorkbookSheet } from "@/lib/spreadsheet/extractWorkbook";

function toFieldKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseNumericMaybe(value: string): number | string | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : trimmed;
}

function normalizeStatus(rawStatus: string): NormalizedStatus {
  const status = rawStatus.toLowerCase();
  if (status.includes("control")) return "control";
  if (status.includes("context")) return "context";
  if (status.includes("derived")) return "derived";
  if (status.includes("public") && status.includes("projection")) return "public_projection";
  if (status.includes("estimate") && status.includes("projection")) return "estimate_projection";
  if (status.includes("estimate")) return "estimate";
  if (status.includes("public")) return "public";
  return "unknown";
}

function toMetricClass(status: NormalizedStatus): MetricClass {
  switch (status) {
    case "public":
      return "historical_public_anchor";
    case "public_projection":
      return "projection";
    case "estimate":
    case "estimate_projection":
      return "modeled_estimate";
    case "derived":
      return "derived";
    case "control":
      return "control";
    case "context":
      return "context";
    default:
      return "unknown";
  }
}

function parseConfidence(raw: string): Confidence {
  if (raw === "High" || raw === "Medium" || raw === "Low") {
    return raw;
  }
  return "Unknown";
}

function requireSheet(workbook: RawWorkbook, name: string): RawWorkbookSheet {
  const sheet = workbook.sheets.find((entry) => entry.name === name);
  if (!sheet) {
    throw new Error(`Missing required sheet: ${name}`);
  }
  return sheet;
}

function rowHasAnyValue(row: string[]): boolean {
  return row.some((cell) => (cell ?? "").trim().length > 0);
}

export function normalizeMasterModel(workbook: RawWorkbook): MasterModelMetric[] {
  const sheet = requireSheet(workbook, "Master_Model");

  const headerIndex = sheet.rows.findIndex((row) => row[0] === "ID" && row[2] === "Field");
  if (headerIndex < 0) {
    throw new Error("Master_Model missing expected header row");
  }

  const dataRows = sheet.rows.slice(headerIndex + 1).filter(rowHasAnyValue);

  return dataRows
    .filter((row) => row[0] && /^\d/.test(row[0]))
    .map((row) => {
      const rawStatus = row[10] ?? "";
      const normalized = normalizeStatus(rawStatus);
      const fieldLabel = row[2] ?? "";

      const valuesByYear = Object.fromEntries(
        MODEL_YEARS.map((year, i) => [year, parseNumericMaybe(row[4 + i] ?? "")])
      );

      return {
        id: row[0],
        group: row[1] ?? "",
        fieldKey: `${row[0]}_${toFieldKey(fieldLabel)}`,
        fieldLabel,
        unit: row[3] ?? "",
        valuesByYear,
        rawStatus,
        normalizedStatus: normalized,
        metricClass: toMetricClass(normalized),
        confidence: parseConfidence(row[11] ?? ""),
        source: {
          workbook: workbook.filePath,
          sheet: "Master_Model",
          method: row[12] ?? "",
        },
        notes: row[13] ?? "",
      } satisfies MasterModelMetric;
    });
}

export function normalizeAssumptions(workbook: RawWorkbook): AssumptionRecord[] {
  const sheet = requireSheet(workbook, "Assumptions");
  const headerIndex = sheet.rows.findIndex(
    (row) => row[0] === "Category" && row[1] === "Driver"
  );

  if (headerIndex < 0) {
    throw new Error("Assumptions missing expected header row");
  }

  const dataRows = sheet.rows.slice(headerIndex + 1).filter(rowHasAnyValue);

  return dataRows
    .filter((row) => row[0] && row[1])
    .map((row) => {
      const rawStatus = row[10] ?? "";
      const normalized = normalizeStatus(rawStatus);

      return {
        category: row[0],
        driver: row[1],
        fieldKey: `${toFieldKey(row[0])}_${toFieldKey(row[1])}`,
        valuesByYear: Object.fromEntries(
          MODEL_YEARS.map((year, i) => [year, parseNumericMaybe(row[2 + i] ?? "")])
        ),
        unit: row[8] ?? "",
        rawStatus,
        normalizedStatus: normalized,
        metricClass: toMetricClass(normalized),
        sourceMethod: row[9] ?? "",
      } satisfies AssumptionRecord;
    });
}

function scenarioFromIndex(index: number): (typeof SCENARIO_NAMES)[number] {
  const scenario = SCENARIO_NAMES[index] as (typeof SCENARIO_NAMES)[number] | undefined;
  if (!scenario) {
    throw new Error(`Unexpected scenario index: ${index}`);
  }
  return scenario;
}

export function normalizeScenarioOnePager(workbook: RawWorkbook): {
  levers: ScenarioLeverRecord[];
  projections: ScenarioProjectionRecord[];
} {
  const sheet = requireSheet(workbook, "Scenario_OnePager");

  const leverHeaderIndex = sheet.rows.findIndex(
    (row) => row[0] === "Lever / Output" && row[1] === "Efficiency / Ops"
  );

  if (leverHeaderIndex < 0) {
    throw new Error("Scenario_OnePager missing expected lever header");
  }

  const leverRows = sheet.rows
    .slice(leverHeaderIndex + 1)
    .filter((row) => rowHasAnyValue(row) && row[0] && row[0] !== "Lever / Output");

  const dividerIndex = leverRows.findIndex((row) => row[0] === "Projected attendance");
  if (dividerIndex < 0) {
    throw new Error("Scenario_OnePager missing projected attendance block");
  }

  const leverBlock = leverRows.slice(0, dividerIndex);
  const projectionBlock = leverRows.slice(dividerIndex);

  const levers = leverBlock.map((row) => ({
    leverKey: toFieldKey(row[0]),
    leverLabel: row[0],
    valuesByScenario: Object.fromEntries(
      [0, 1, 2].map((idx) => [scenarioFromIndex(idx), Number(row[1 + idx] ?? NaN)])
    ) as Record<(typeof SCENARIO_NAMES)[number], number | null>,
  }));

  const projections = projectionBlock.map((row) => ({
    metricKey: toFieldKey(row[0]),
    metricLabel: row[0],
    valuesByScenario: Object.fromEntries(
      [0, 1, 2].map((idx) => {
        const value = parseNumericMaybe(row[1 + idx] ?? "");
        return [scenarioFromIndex(idx), typeof value === "number" ? value : null];
      })
    ) as Record<(typeof SCENARIO_NAMES)[number], number | null>,
  }));

  return { levers, projections };
}

export function validateScenarioNames(scenarios: string[]): void {
  const expected = new Set(SCENARIO_NAMES);
  const invalid = scenarios.filter((name) => !expected.has(name as (typeof SCENARIO_NAMES)[number]));
  if (invalid.length > 0) {
    throw new Error(`Invalid scenario names: ${invalid.join(", ")}`);
  }
}
