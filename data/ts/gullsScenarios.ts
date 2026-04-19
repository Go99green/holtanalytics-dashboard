import assumptions from "@/data/normalized/gulls.assumptions.json";
import scenarioOnePager from "@/data/normalized/gulls.scenario-onepager.json";
import type { DashboardScenarioConfig, ScenarioName } from "@/lib/types/dashboard";

const scenarioNames: ScenarioName[] = ["Baseline", "Tactical", "Aggressive"];

function getControlValue(fieldKey: string): number {
  const control = assumptions.find((row) => row.fieldKey === fieldKey);
  const value = control?.valuesByYear?.["2026-27"];
  return typeof value === "number" ? value : 0;
}

export const scenarioConfigs: Record<ScenarioName, DashboardScenarioConfig> = {
  Baseline: {
    name: "Baseline",
    growth: {
      attendanceGrowth: getControlValue("control_2026_27_attendance_growth_assumption"),
      watpGrowth: getControlValue("control_2026_27_watp_growth_assumption"),
      sponsorshipGrowth: getControlValue("control_2026_27_sponsorship_growth_assumption"),
      digitalGrowth: getControlValue("control_2026_27_website_traffic_growth_assumption"),
      ebitdaLift: 0.12,
    },
  },
  Tactical: {
    name: "Tactical",
    growth: {
      attendanceGrowth: 0.06,
      watpGrowth: 0.05,
      sponsorshipGrowth: 0.12,
      digitalGrowth: 0.12,
      ebitdaLift: 0.2,
    },
  },
  Aggressive: {
    name: "Aggressive",
    growth: {
      attendanceGrowth: 0.09,
      watpGrowth: 0.075,
      sponsorshipGrowth: 0.16,
      digitalGrowth: 0.16,
      ebitdaLift: 0.32,
    },
  },
};

export const fy27ScenarioProjections = scenarioOnePager.projections;
export const fy27ScenarioLevers = scenarioOnePager.levers;
export const scenarioOrder = scenarioNames;
