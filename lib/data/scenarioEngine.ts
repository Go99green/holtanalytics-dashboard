import type {
  DashboardScenarioConfig,
  HistoricalAnchor,
  ModelYear,
  ScenarioName,
} from "@/lib/types/dashboard";

export type DashboardYearPoint = {
  year: string;
  attendance: number;
  watp: number;
  revenue: number;
  ebitda: number;
  sponsorship: number;
  digitalVisits: number;
  stmBase: number;
  parkingScore: number;
  opsScore: number;
  marketingScore: number;
};

export type ProjectedYear = DashboardYearPoint & {
  valuation: number;
  ebitdaMargin: number;
  capPct: number;
};

export function validateScenarioName(scenario: string): scenario is ScenarioName {
  return scenario === "Baseline" || scenario === "Tactical" || scenario === "Aggressive";
}

export function projectFromConfig(
  base: DashboardYearPoint,
  selectedScenario: ScenarioName,
  config: DashboardScenarioConfig
): ProjectedYear {
  const attendanceGrowth = config.growth.attendanceGrowth ?? 0;
  const watpGrowth = config.growth.watpGrowth ?? 0;
  const sponsorshipGrowth = config.growth.sponsorshipGrowth ?? 0;
  const digitalGrowth = config.growth.digitalGrowth ?? 0;
  const ebitdaLift = config.growth.ebitdaLift ?? 0;

  const attendance = Math.round(base.attendance * (1 + attendanceGrowth));
  const watp = Number((base.watp * (1 + watpGrowth)).toFixed(1));
  const revenue = Number(
    (
      base.revenue *
      (1 + attendanceGrowth * 0.55 + watpGrowth * 0.8 + sponsorshipGrowth * 0.22)
    ).toFixed(1)
  );
  const ebitda = Number((base.ebitda * (1 + ebitdaLift)).toFixed(1));
  const sponsorship = Number((base.sponsorship * (1 + sponsorshipGrowth)).toFixed(2));
  const digitalVisits = Number((base.digitalVisits * (1 + digitalGrowth)).toFixed(1));
  const stmBase = Math.round(base.stmBase * (1 + attendanceGrowth * 0.5));

  const scenarioBump =
    selectedScenario === "Baseline"
      ? { parking: 5, ops: 4, marketing: 6 }
      : selectedScenario === "Tactical"
      ? { parking: 11, ops: 9, marketing: 12 }
      : { parking: 16, ops: 14, marketing: 17 };

  const parkingScore = Math.min(78, base.parkingScore + scenarioBump.parking);
  const opsScore = Math.min(85, base.opsScore + scenarioBump.ops);
  const marketingScore = Math.min(90, base.marketingScore + scenarioBump.marketing);
  const valuation = Number((revenue * 3.2).toFixed(1));
  const ebitdaMargin = Number(((ebitda / revenue) * 100).toFixed(1));
  const capPct = Number(((attendance / 12920) * 100).toFixed(1));

  return {
    year: "2026-27",
    attendance,
    watp,
    revenue,
    ebitda,
    sponsorship,
    digitalVisits,
    stmBase,
    parkingScore,
    opsScore,
    marketingScore,
    valuation,
    ebitdaMargin,
    capPct,
  };
}

export function buildHistoricalSeries(
  anchors: HistoricalAnchor[],
  getMetric: (metrics: HistoricalAnchor["metrics"], key: string) => number
): DashboardYearPoint[] {
  return anchors.map((anchor) => ({
    year: anchor.year as Exclude<ModelYear, "2026-27">,
    attendance: getMetric(anchor.metrics, "attendance"),
    watp: getMetric(anchor.metrics, "watp"),
    revenue: getMetric(anchor.metrics, "revenue"),
    ebitda: getMetric(anchor.metrics, "ebitda"),
    sponsorship: getMetric(anchor.metrics, "sponsorship"),
    digitalVisits: getMetric(anchor.metrics, "digital_visits"),
    stmBase: getMetric(anchor.metrics, "stm_base"),
    parkingScore: getMetric(anchor.metrics, "parking_score"),
    opsScore: getMetric(anchor.metrics, "ops_score"),
    marketingScore: getMetric(anchor.metrics, "marketing_score"),
  }));
}
