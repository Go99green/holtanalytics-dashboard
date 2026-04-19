"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { loadDashboardData } from "@/lib/data/loadDashboardData";
import { SCENARIO_NAMES, type ScenarioName } from "@/lib/types/dashboard";
import authorProfile from "@/data/ts/authorProfile";

type SectionKey =
  | "leadership"
  | "performance"
  | "friction"
  | "recommendations"
  | "methodology"
  | "author";

type MetricCard = {
  label: string;
  value: string;
  delta?: string;
  detail: string;
  tooltip: string;
};

const NAV_ITEMS: { key: SectionKey; label: string }[] = [
  { key: "leadership", label: "Leadership Brief" },
  { key: "performance", label: "Performance Lens" },
  { key: "friction", label: "Operating Gaps" },
  { key: "recommendations", label: "Priority Moves" },
  { key: "methodology", label: "Methodology" },
  { key: "author", label: "Author" },
];

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatMillions(value: number): string {
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function getMetricByKey(rows: ReturnType<typeof loadDashboardData>["masterModel"], key: string) {
  return rows.find((row) => row.fieldKey === key);
}

function buildTrendPath(values: number[], width: number, height: number, padding: number): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * usableWidth;
      const ratio = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - padding - ratio * usableHeight;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function ScenarioButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: ScenarioName;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-[#F47A38] bg-[#F47A38]/20 text-orange-100"
          : "border-slate-500/50 bg-slate-900/40 text-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function SectionNav({ active, onChange }: { active: SectionKey; onChange: (s: SectionKey) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-700/60 bg-[#111827]/80 p-2">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition ${
            active === item.key
              ? "bg-[#D9E2EC] text-[#0B0F14]"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  const data = useMemo(() => loadDashboardData(), []);
  const [scenario, setScenario] = useState<ScenarioName>("Tactical");
  const [activeSection, setActiveSection] = useState<SectionKey>("leadership");
  const [compareBaseline, setCompareBaseline] = useState(true);
  const [openMethodology, setOpenMethodology] = useState(false);
  const [activeIssue, setActiveIssue] = useState<number>(1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const attendanceSeries = getMetricByKey(data.masterModel, "1_average_attendance")?.valuesByYear;
  const watpSeries = getMetricByKey(data.masterModel, "20_weighted_average_ticket_price_modeled")?.valuesByYear;
  const revenueSeries = getMetricByKey(data.masterModel, "46_gross_annual_revenue")?.valuesByYear;

  const years = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"] as const;
  const historicalTrend = years.map((year) => ({
    year,
    attendance: Number(attendanceSeries?.[year] ?? 0),
    watp: Number(watpSeries?.[year] ?? 0),
    revenue: Number(revenueSeries?.[year] ?? 0),
  }));

  const projectionIndex = new Map(
    data.fy27ScenarioProjections.map((item) => [item.metricKey, item.valuesByScenario])
  );

  const selectedProjection = {
    attendance: Number(projectionIndex.get("projected_attendance")?.[scenario] ?? 0),
    watp: Number(projectionIndex.get("projected_watp")?.[scenario] ?? 0),
    revenue: Number(projectionIndex.get("projected_total_revenue")?.[scenario] ?? 0),
    ebitda: Number(projectionIndex.get("projected_ebitda")?.[scenario] ?? 0),
    valuation: Number(projectionIndex.get("projected_valuation")?.[scenario] ?? 0),
  };

  const baselineProjection = {
    attendance: Number(projectionIndex.get("projected_attendance")?.Baseline ?? 0),
    watp: Number(projectionIndex.get("projected_watp")?.Baseline ?? 0),
    revenue: Number(projectionIndex.get("projected_total_revenue")?.Baseline ?? 0),
    ebitda: Number(projectionIndex.get("projected_ebitda")?.Baseline ?? 0),
    valuation: Number(projectionIndex.get("projected_valuation")?.Baseline ?? 0),
  };

  const trendWithScenario = [...historicalTrend, { year: "2026-27", ...selectedProjection }];
  const revenueDeltaVsBaseline =
    baselineProjection.revenue > 0
      ? (selectedProjection.revenue - baselineProjection.revenue) / baselineProjection.revenue
      : 0;

  const ebitdaMargin =
    selectedProjection.revenue > 0 ? selectedProjection.ebitda / selectedProjection.revenue : 0;

  const cards: MetricCard[] = [
    {
      label: "FY27 Revenue Outlook",
      value: formatMillions(selectedProjection.revenue),
      delta: compareBaseline ? `${PERCENT.format(revenueDeltaVsBaseline)} vs Baseline` : undefined,
      detail: "Modeled gross annual revenue under selected scenario",
      tooltip:
        "Illustrative modeled revenue benchmark for FY27 based on workbook assumptions and selected scenario levers.",
    },
    {
      label: "FY27 EBITDA",
      value: formatMillions(selectedProjection.ebitda),
      detail: `EBITDA margin ${PERCENT.format(ebitdaMargin)}`,
      tooltip:
        "Illustrative operating earnings benchmark after modeled costs; used for decision-support, not audited reporting.",
    },
    {
      label: "Modeled Franchise Value Benchmark",
      value: formatMillions(selectedProjection.valuation),
      detail: "Revenue-multiple illustrative benchmark",
      tooltip:
        "Illustrative valuation benchmark derived from modeled revenue multiple assumptions for strategic planning context.",
    },
    {
      label: "Projected Attendance",
      value: formatNumber(selectedProjection.attendance),
      detail: `WATP ${CURRENCY.format(selectedProjection.watp)}`,
      tooltip:
        "Attendance and WATP (weighted average ticket price) under the selected FY27 scenario.",
    },
  ];

  const activeIssueDetails = data.issueBacklog.find((issue) => issue.id === activeIssue);
  const recommendations = data.actionPlan.slice(0, 5);

  const width = 900;
  const height = 300;
  const padding = 28;
  const revenuePoints = trendWithScenario.map((point) => point.revenue);
  const attendancePoints = trendWithScenario.map((point) => point.attendance);
  const revenuePath = buildTrendPath(revenuePoints, width, height, padding);
  const attendancePath = buildTrendPath(attendancePoints, width, height, padding);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#003153_0%,#041E42_45%,#0B0F14_100%)] text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">
        <section className="rounded-3xl border border-slate-700/60 bg-slate-950/65 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon.svg"
                  alt="Holt Analytics mark"
                  width={38}
                  height={38}
                  className="rounded-md border border-slate-600/70 bg-slate-900/70 object-contain p-1"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F47A38]">
                  San Diego Gulls · Executive Commercial Intelligence
                </p>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-white lg:text-5xl">
                Closing the Revenue Gap: Data-Driven Strategies to Scale Gulls Commercial
                Performance Through FY27
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 lg:text-base">
                Decision dashboard for ticketing, partnerships, and operations leadership to improve
                conversion, per-cap economics, and margin preservation through FY27 scenario planning.
              </p>
              <p className="text-sm font-medium text-slate-200">
                Prepared by {authorProfile.name} · {authorProfile.company}
              </p>
            </div>
            <div className="space-y-3 lg:min-w-[320px]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Scenario Switch</p>
              <div className="flex flex-wrap gap-2">
                {SCENARIO_NAMES.map((name) => (
                  <ScenarioButton
                    key={name}
                    label={name}
                    active={scenario === name}
                    onClick={() => setScenario(name)}
                  />
                ))}
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-500 bg-slate-900"
                  checked={compareBaseline}
                  onChange={(event) => setCompareBaseline(event.target.checked)}
                />
                Compare against Baseline scenario
              </label>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-700/60 bg-[#111827]/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            What Leadership Should Focus on Now
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {[
              "Reduce ticketing conversion friction",
              "Productize military demand with Tactical Flex Pass",
              "Improve second-game conversion engine",
              "Increase sponsor inventory yield and digital sell-through",
              "Preserve margin in the Pechanga legacy era pre-transition",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6">
          <SectionNav active={activeSection} onChange={setActiveSection} />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-700/60 bg-[#111827]/70 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
              {card.delta ? <p className="mt-2 text-sm font-semibold text-[#F47A38]">{card.delta}</p> : null}
              <p className="mt-2 text-sm text-slate-300">{card.detail}</p>
              <p className="mt-2 text-xs text-slate-400">{card.tooltip}</p>
            </article>
          ))}
        </section>

        {(activeSection === "leadership" || activeSection === "performance") && (
          <section className="mt-6 rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Historical vs FY27 Scenario Trend</h2>
              <p className="text-sm text-slate-300">Hover chart to inspect values</p>
            </div>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-[320px] w-full rounded-2xl bg-slate-950/60"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <path d={revenuePath} fill="none" stroke="#F47A38" strokeWidth="4" />
              <path d={attendancePath} fill="none" stroke="#60a5fa" strokeWidth="4" />
              {trendWithScenario.map((point, index) => {
                const x = padding + (index / Math.max(trendWithScenario.length - 1, 1)) * (width - padding * 2);
                const revMin = Math.min(...revenuePoints);
                const revMax = Math.max(...revenuePoints);
                const revRatio = revMax === revMin ? 0.5 : (point.revenue - revMin) / (revMax - revMin);
                const y = height - padding - revRatio * (height - padding * 2);

                return (
                  <g key={point.year} onMouseEnter={() => setHoverIndex(index)}>
                    <circle cx={x} cy={y} r={hoverIndex === index ? 8 : 5} fill="#fdba74" />
                    <text x={x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="12">
                      {point.year}
                    </text>
                  </g>
                );
              })}
            </svg>
            {hoverIndex !== null ? (
              <div className="mt-4 rounded-xl border border-slate-600 bg-slate-950/70 p-4 text-sm text-slate-200">
                <p className="font-semibold text-white">{trendWithScenario[hoverIndex].year}</p>
                <p>Revenue: {formatMillions(trendWithScenario[hoverIndex].revenue)}</p>
                <p>Attendance: {formatNumber(trendWithScenario[hoverIndex].attendance)}</p>
                <p>WATP: {CURRENCY.format(trendWithScenario[hoverIndex].watp)}</p>
              </div>
            ) : null}
          </section>
        )}

        {(activeSection === "leadership" || activeSection === "recommendations") && (
          <section className="mt-6 rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
            <h2 className="text-xl font-semibold text-white">Priority Recommendation Engine</h2>
            <p className="mt-2 text-sm text-slate-300">
              Highest-value commercial and operational moves to convert demand into predictable revenue
              and operating leverage.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((item) => (
                <article key={item.move} className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#F47A38]">{item.pillar}</p>
                  <h3 className="mt-2 text-base font-semibold text-white">{item.move}</h3>
                  <p className="mt-2 text-sm font-medium text-orange-100">Impact: {item.lift}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.why}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {(activeSection === "friction" || activeSection === "leadership") && (
          <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
              <h2 className="text-xl font-semibold text-white">Operating Gap Map</h2>
              <p className="mt-2 text-sm text-slate-300">
                Select a friction point to view ownership and business impact.
              </p>
              <div className="mt-4 space-y-2">
                {data.issueBacklog.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssue(issue.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      issue.id === activeIssue
                        ? "border-[#F47A38]/80 bg-[#F47A38]/10"
                        : "border-slate-700 bg-slate-950/60 hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{issue.title}</p>
                    <p className="mt-1 text-xs text-slate-300">Severity: {issue.severity}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
              <h3 className="text-lg font-semibold text-white">Selected Gap Brief</h3>
              {activeIssueDetails ? (
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  <p>
                    <span className="font-semibold text-slate-100">Owner: </span>
                    {activeIssueDetails.owner}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Business impact: </span>
                    {activeIssueDetails.impact}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Recommended intervention: </span>
                    {activeIssueDetails.action}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Strategic context: </span>
                    Midway Rising and the Pechanga legacy window require defending premium yield and
                    operating leverage before a future facility transition.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {(activeSection === "performance" || activeSection === "methodology") && (
          <section className="mt-6 rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
            <h2 className="text-xl font-semibold text-white">Scenario Comparison vs Baseline</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-300">
                  <tr>
                    <th className="pb-3 pr-6">Metric</th>
                    <th className="pb-3 pr-6">Baseline</th>
                    <th className="pb-3 pr-6">{scenario}</th>
                    <th className="pb-3">Delta</th>
                  </tr>
                </thead>
                <tbody className="text-slate-100">
                  {[
                    ["Revenue", baselineProjection.revenue, selectedProjection.revenue, formatMillions],
                    ["EBITDA", baselineProjection.ebitda, selectedProjection.ebitda, formatMillions],
                    [
                      "Modeled Value Benchmark",
                      baselineProjection.valuation,
                      selectedProjection.valuation,
                      formatMillions,
                    ],
                    ["Attendance", baselineProjection.attendance, selectedProjection.attendance, formatNumber],
                  ].map(([label, base, selected, formatter]) => {
                    const delta = Number(selected) - Number(base);
                    const ratio = Number(base) > 0 ? delta / Number(base) : 0;
                    return (
                      <tr key={String(label)} className="border-t border-slate-800/80">
                        <td className="py-3 pr-6 font-medium">{String(label)}</td>
                        <td className="py-3 pr-6">{(formatter as (n: number) => string)(Number(base))}</td>
                        <td className="py-3 pr-6">{(formatter as (n: number) => string)(Number(selected))}</td>
                        <td className={`py-3 font-semibold ${delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          {delta >= 0 ? "+" : ""}
                          {(formatter as (n: number) => string)(Math.abs(delta))} ({PERCENT.format(ratio)})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(activeSection === "methodology" || activeSection === "leadership") && (
          <section className="mt-6 rounded-3xl border border-slate-700/60 bg-[#111827]/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Data Sources & Trust Framework</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Public anchors, modeled estimates, and scenario projections are separated to preserve
                  decision quality and transparency.
                </p>
              </div>
              <button
                onClick={() => setOpenMethodology((value) => !value)}
                className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100"
              >
                {openMethodology ? "Collapse" : "Expand"}
              </button>
            </div>

            {openMethodology ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-200">Public Anchors</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Public AHL attendance records, team schedule/ticket pages, and official market context.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-200">Modeled Estimates</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Structured estimates for monetization drivers, retention, yield, and per-cap dynamics.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Scenario Projections</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Baseline, Tactical, and Aggressive outputs from workbook scenario sheets.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-indigo-200">Workbook Assumptions</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Control rates and assumption rows are loaded from normalized workbook artifacts.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Limits & Data Hygiene</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Formula-driven workbook cells rely on cached values where applicable; interpretation is
                    decision-support, not audited finance.
                  </p>
                </div>
              </div>
            ) : null}
          </section>
        )}

        <footer className="mt-8 rounded-3xl border border-slate-700/60 bg-slate-950/70 p-6">
          <div className="grid gap-5 lg:grid-cols-[0.25fr_0.95fr_0.8fr]">
            <div className="flex items-start justify-center lg:justify-start">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-[#003153] to-[#0B0F14] text-2xl font-bold text-[#D9E2EC] md:h-32 md:w-32">
                KH
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">About the Author</h2>
              <p className="mt-2 text-sm text-slate-300">
                {authorProfile.name} · {authorProfile.title} · {authorProfile.company}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                This executive interface is designed as a decision-support system focused on revenue,
                operations, and scenario planning for the San Diego Gulls.
              </p>
              <p className="mt-3 text-sm text-slate-300">
                Why this profile fits the room: MBA-candidate strategic revenue lens, Army veteran
                military audience credibility, CrossFit performance-culture insight, and creative
                background bridging analytics with content and brand execution.
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-300" id="author-contact">
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                <a className="text-slate-100 underline" href={`mailto:${authorProfile.email}`}>
                  {authorProfile.email}
                </a>
              </p>
              <p>
                <span className="text-slate-400">LinkedIn:</span>{" "}
                <a className="text-slate-100 underline" href={authorProfile.linkedIn} target="_blank" rel="noreferrer">
                  {authorProfile.linkedIn}
                </a>
              </p>
              <p>
                <span className="text-slate-400">Website:</span>{" "}
                <a
                  className="text-slate-100 underline"
                  href={`https://${authorProfile.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {authorProfile.website}
                </a>
              </p>
              <p className="pt-2 text-xs text-slate-400">
                Commercial concept: Tactical Flex Pass / Ready Reserve Flex Pack (10-game digital wallet
                design for active-duty, reserve, and transient military households).
              </p>
              <p className="text-xs text-slate-400">
                Ops integration: connect ticketing, parking, POS/per-cap, and Legends hospitality data
                to improve sponsor yield and margin preservation.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
