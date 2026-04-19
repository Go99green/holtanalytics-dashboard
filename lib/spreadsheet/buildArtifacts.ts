import fs from "node:fs";
import path from "node:path";
import { assertRequiredSheets, extractWorkbook } from "@/lib/spreadsheet/extractWorkbook";
import {
  normalizeAssumptions,
  normalizeMasterModel,
  normalizeScenarioOnePager,
  validateScenarioNames,
} from "@/lib/spreadsheet/normalizeModel";
import {
  SCENARIO_NAMES,
  type WorkbookConflict,
  type WorkbookIdentity,
} from "@/lib/types/dashboard";

const REQUIRED_SHEETS = ["Assumptions", "Master_Model", "Scenario_OnePager", "Source_Log"];

const WORKBOOKS: WorkbookIdentity[] = [
  {
    key: "primary",
    fileName: "San_Diego_Gulls_Forensic_Model_2021_2027.xlsx",
    priority: 1,
  },
  {
    key: "secondary",
    fileName: "San_Diego_Gulls_Forensic_Model_2021_2027_Executive.xlsx",
    priority: 2,
  },
  {
    key: "tertiary",
    fileName: "Holt_Keegan_Gulls_Eval.xlsx",
    priority: 3,
  },
];

function findConflictSamples(
  primaryMaster: ReturnType<typeof normalizeMasterModel>,
  secondaryMaster: ReturnType<typeof normalizeMasterModel>,
  workbookName: string
): WorkbookConflict[] {
  const secondaryByField = new Map(secondaryMaster.map((row) => [row.fieldKey, row]));
  const conflicts: WorkbookConflict[] = [];

  for (const metric of primaryMaster) {
    const secondaryMetric = secondaryByField.get(metric.fieldKey);
    if (!secondaryMetric) continue;

    for (const year of Object.keys(metric.valuesByYear)) {
      const left = metric.valuesByYear[year] ?? null;
      const right = secondaryMetric.valuesByYear[year] ?? null;
      if (left !== right && right !== null) {
        conflicts.push({
          sheet: "Master_Model",
          fieldKey: metric.fieldKey,
          years: [year],
          primaryValue: left,
          conflictingWorkbook: workbookName,
          conflictingValue: right,
          note: "Conflicting populated value detected across workbook priorities.",
        });
        break;
      }
    }
  }

  return conflicts;
}

export function buildArtifacts(repoRoot = process.cwd()): void {
  const resolved = WORKBOOKS.map((wb) => ({
    identity: wb,
    filePath: path.join(repoRoot, wb.fileName),
  }));

  const extracted = resolved.map(({ identity, filePath }) => {
    const workbook = extractWorkbook(filePath);
    assertRequiredSheets(workbook, REQUIRED_SHEETS);
    return { identity, workbook };
  });

  const primary = extracted[0];
  const primaryMaster = normalizeMasterModel(primary.workbook);
  const primaryAssumptions = normalizeAssumptions(primary.workbook);
  const primaryScenario = normalizeScenarioOnePager(primary.workbook);

  validateScenarioNames([...SCENARIO_NAMES]);

  const conflicts = extracted.slice(1).flatMap(({ identity, workbook }) => {
    try {
      const normalized = normalizeMasterModel(workbook);
      return findConflictSamples(primaryMaster, normalized, identity.fileName);
    } catch {
      return [
        {
          sheet: "Master_Model",
          fieldKey: "n/a",
          years: [],
          primaryValue: null,
          conflictingWorkbook: identity.fileName,
          conflictingValue: null,
          note: "Workbook appears formula-driven or structurally inconsistent for static extraction.",
        } satisfies WorkbookConflict,
      ];
    }
  });

  const normalizedDir = path.join(repoRoot, "data", "normalized");
  fs.mkdirSync(normalizedDir, { recursive: true });

  fs.writeFileSync(
    path.join(normalizedDir, "gulls.master-model.json"),
    JSON.stringify(primaryMaster, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(normalizedDir, "gulls.assumptions.json"),
    JSON.stringify(primaryAssumptions, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(normalizedDir, "gulls.scenario-onepager.json"),
    JSON.stringify(primaryScenario, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(normalizedDir, "gulls.sources.json"),
    JSON.stringify(
      {
        selectedWorkbook: WORKBOOKS[0],
        consideredWorkbooks: WORKBOOKS,
        conflicts,
        formulaReadLimitation:
          "XLSX formulas are read as cached values only; uncalculated formula cells may be blank in static extraction.",
      },
      null,
      2
    ) + "\n"
  );
}

if (process.argv[1] && process.argv[1].endsWith("buildArtifacts.ts")) {
  buildArtifacts();
}
