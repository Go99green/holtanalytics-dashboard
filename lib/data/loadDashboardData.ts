import assumptions from "@/data/normalized/gulls.assumptions.json";
import masterModel from "@/data/normalized/gulls.master-model.json";
import scenarioOnePager from "@/data/normalized/gulls.scenario-onepager.json";
import sourceMeta from "@/data/normalized/gulls.sources.json";
import { actionPlan } from "@/data/ts/gullsActions";
import { benchmarkTeams } from "@/data/ts/gullsBenchmarks";
import { historicalPublicAnchors } from "@/data/ts/gullsHistorical";
import { issueBacklog } from "@/data/ts/gullsIssues";
import { modeledEstimates } from "@/data/ts/gullsModeled";
import { fy27ScenarioLevers, fy27ScenarioProjections, scenarioConfigs } from "@/data/ts/gullsScenarios";
import { SCENARIO_NAMES } from "@/lib/types/dashboard";

const REQUIRED_SCENARIO_COLUMNS = ["Baseline", "Tactical", "Aggressive"] as const;

export function validateNormalizedData(): void {
  const requiredSheets = ["Master_Model", "Assumptions", "Scenario_OnePager"];
  if (!sourceMeta?.selectedWorkbook?.fileName) {
    throw new Error("Missing selected workbook metadata");
  }

  for (const key of REQUIRED_SCENARIO_COLUMNS) {
    if (!SCENARIO_NAMES.includes(key)) {
      throw new Error(`Scenario not allowed: ${key}`);
    }
  }

  if (!Array.isArray(masterModel) || masterModel.length === 0) {
    throw new Error("Master model artifact is empty");
  }
  if (!Array.isArray(assumptions) || assumptions.length === 0) {
    throw new Error("Assumptions artifact is empty");
  }
  if (!Array.isArray(scenarioOnePager.levers) || !Array.isArray(scenarioOnePager.projections)) {
    throw new Error("Scenario one-pager artifact missing expected sections");
  }

  if (requiredSheets.length === 0) {
    throw new Error("Required sheet definition is empty");
  }
}

export function loadDashboardData() {
  validateNormalizedData();

  return {
    workbook: sourceMeta,
    historicalPublicAnchors,
    modeledEstimates,
    assumptions,
    masterModel,
    fy27ScenarioLevers,
    fy27ScenarioProjections,
    scenarioConfigs,
    benchmarkTeams,
    issueBacklog,
    actionPlan,
  };
}
