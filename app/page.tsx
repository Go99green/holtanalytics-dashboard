"use client";

import React, { useMemo, useState } from "react";

type Scenario = "Baseline" | "Tactical" | "Aggressive";
type Tab = "overview" | "recon" | "issues" | "action";

type YearPoint = {
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

type ProjectedYear = YearPoint & {
  valuation: number;
  ebitdaMargin: number;
  capPct: number;
};

export default function Page() {
  const [scenario, setScenario] = useState<Scenario>("Tactical");
  const [tab, setTab] = useState<Tab>("overview");

  const baseYears = useMemo<YearPoint[]>(
    () => [
      {
        year: "2021-22",
        attendance: 6992,
        watp: 22.0,
        revenue: 10.6,
        ebitda: 1.2,
        sponsorship: 1.95,
        digitalVisits: 28,
        stmBase: 2300,
        parkingScore: 48,
        opsScore: 56,
        marketingScore: 58,
      },
      {
        year: "2022-23",
        attendance: 6953,
        watp: 22.4,
        revenue: 10.8,
        ebitda: 1.15,
        sponsorship: 2.0,
        digitalVisits: 29,
        stmBase: 2350,
        parkingScore: 49,
        opsScore: 57,
        marketingScore: 59,
      },
      {
        year: "2023-24",
        attendance: 7249,
        watp: 23.4,
        revenue: 11.8,
        ebitda: 1.55,
        sponsorship: 2.2,
        digitalVisits: 31,
        stmBase: 2450,
        parkingScore: 50,
        opsScore: 61,
        marketingScore: 64,
      },
      {
        year: "2024-25",
        attendance: 7262,
        watp: 24.4,
        revenue: 12.5,
        ebitda: 1.75,
        sponsorship: 2.45,
        digitalVisits: 33,
        stmBase: 2550,
        parkingScore: 51,
        opsScore: 63,
        marketingScore: 67,
      },
      {
        year: "2025-26",
        attendance: 7403,
        watp: 25.4,
        revenue: 13.4,
        ebitda: 2.1,
        sponsorship: 2.7,
        digitalVisits: 35.2,
        stmBase: 2700,
        parkingScore: 52,
        opsScore: 66,
        marketingScore: 70,
      },
    ],
    []
  );

  const scenarioMap = useMemo(
    () => ({
      Baseline: {
        attendanceGrowth: 0.03,
        watpGrowth: 0.03,
        sponsorshipGrowth: 0.08,
        digitalGrowth: 0.08,
        ebitdaLift: 0.12,
      },
      Tactical: {
        attendanceGrowth: 0.065,
        watpGrowth: 0.05,
        sponsorshipGrowth: 0.12,
        digitalGrowth: 0.14,
        ebitdaLift: 0.2,
      },
      Aggressive: {
        attendanceGrowth: 0.095,
        watpGrowth: 0.075,
        sponsorshipGrowth: 0.17,
        digitalGrowth: 0.2,
        ebitdaLift: 0.32,
      },
    }),
    []
  );

  const benchmarkTeams = useMemo(
    () => [
      { label: "San Diego Gulls", value: 25.4, color: "#FC4C02" },
      { label: "Coachella Valley Firebirds", value: 29.5, color: "#60A5FA" },
      { label: "Henderson Silver Knights", value: 24.1, color: "#34D399" },
      { label: "Ontario Reign", value: 27.2, color: "#FBBF24" },
    ],
    []
  );

  const issueBacklog = useMemo(
    () => [
      {
        id: 1,
        title: "Stale ticketing content and season references",
        severity: "High",
        owner: "Digital + Ticketing",
        impact: "Conversion trust loss and search freshness drag",
        action:
          "Create a single source of truth for season labels, ticket offers, and renewal windows across all pages.",
      },
      {
        id: 2,
        title: "Parking friction is under-addressed in the purchase flow",
        severity: "High",
        owner: "Ops + UX",
        impact: "Day-of-game stress, slower conversion, lower repeat intent",
        action:
          "Add parking guidance, arrival-time prompts, live lot messaging, and prepaid parking bundles in the ticket flow.",
      },
      {
        id: 3,
        title: "Bar-network footprint is too small for market size",
        severity: "Medium",
        owner: "Partnerships + Marketing",
        impact: "Missed neighborhood demand and watch-party acquisition",
        action:
          "Expand to North Park, PB, East County, military-adjacent corridors, and track QR-sourced leads.",
      },
      {
        id: 4,
        title: "Promotions are strong but retention loop is weak",
        severity: "High",
        owner: "BI + CRM",
        impact:
          "Good single-game turnout without enough second-game conversion",
        action:
          "Trigger automated next-game offers and mini-plan nudges by promo-night attendance source.",
      },
      {
        id: 5,
        title: "Military value prop is good but not fully productized",
        severity: "Medium",
        owner: "Sales + Community",
        impact: "Undercaptured demand in a military-heavy market",
        action:
          "Launch veteran unit nights, spouse/family offers, and recurring military affinity group packages.",
      },
    ],
    []
  );

  const actionPlan = useMemo(
    () => [
      {
        pillar: "Revenue",
        move: "Increase ticket yield through better segmentation",
        lift: "+3% to +7% WATP",
        why: "Use dynamic pricing around anniversary nights, rivalry games, and premium sections while protecting value on midweek seats.",
      },
      {
        pillar: "Parking & Ops",
        move: "Treat parking like product, not just logistics",
        lift: "+1% to +2% conversion",
        why: "Parking clarity reduces purchase anxiety and improves arrival flow, especially for families and first-time buyers.",
      },
      {
        pillar: "Marketing",
        move: "Build a second-game conversion engine",
        lift: "+4% to +8% repeat rate",
        why: "Promo attendees should enter automated email and SMS journeys tied to the next best ticket offer.",
      },
      {
        pillar: "Community",
        move: "Own the veteran and active-duty lane",
        lift: "+300 to +700 avg attendance",
        why: "San Diego’s military community is one of the clearest audience advantages the Gulls can organize around.",
      },
      {
        pillar: "Sponsorship",
        move: "Package inventory around measurable outcomes",
        lift: "+8% to +17% sponsorship revenue",
        why: "Sell sponsor bundles around app, content, tailgates, hospitality, and lead capture instead of isolated impressions.",
      },
    ],
    []
  );

  const formatMoney = (value: number) =>
    value >= 1000 ? `$${(value / 1000).toFixed(1)}B` : `$${value.toFixed(1)}M`;

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const metricTone = (value: string) => {
    if (value === "High")
      return "border-red-500/30 bg-red-500/15 text-red-300";
    if (value === "Medium")
      return "border-amber-500/30 bg-amber-500/15 text-amber-300";
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
  };

  const buildLinePath = (
    values: number[],
    width: number,
    height: number,
    padding: number
  ) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return values
      .map((value, index) => {
        const x =
          padding +
          (values.length === 1 ? 0 : (index / (values.length - 1)) * usableWidth);
        const ratio = max === min ? 0.5 : (value - min) / (max - min);
        const y = height - padding - ratio * usableHeight;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  function projectValue(
    base: YearPoint,
    selectedScenario: Scenario,
    config: {
      attendanceGrowth: number;
      watpGrowth: number;
      sponsorshipGrowth: number;
      digitalGrowth: number;
      ebitdaLift: number;
    }
  ): ProjectedYear {
    const attendance = Math.round(base.attendance * (1 + config.attendanceGrowth));
    const watp = Number((base.watp * (1 + config.watpGrowth)).toFixed(1));
    const revenue = Number(
      (
        base.revenue *
        (1 +
          config.attendanceGrowth * 0.55 +
          config.watpGrowth * 0.8 +
          config.sponsorshipGrowth * 0.22)
      ).toFixed(1)
    );
    const ebitda = Number((base.ebitda * (1 + config.ebitdaLift)).toFixed(1));
    const sponsorship = Number(
      (base.sponsorship * (1 + config.sponsorshipGrowth)).toFixed(2)
    );
    const digitalVisits = Number(
      (base.digitalVisits * (1 + config.digitalGrowth)).toFixed(1)
    );
    const stmBase = Math.round(base.stmBase * (1 + config.attendanceGrowth * 0.5));
    const parkingScore = Math.min(
      78,
      base.parkingScore +
        (selectedScenario === "Baseline"
          ? 5
          : selectedScenario === "Tactical"
          ? 11
          : 16)
    );
    const opsScore = Math.min(
      85,
      base.opsScore +
        (selectedScenario === "Baseline"
          ? 4
          : selectedScenario === "Tactical"
          ? 9
          : 14)
    );
    const marketingScore = Math.min(
      90,
      base.marketingScore +
        (selectedScenario === "Baseline"
          ? 6
          : selectedScenario === "Tactical"
          ? 12
          : 17)
    );
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

  const projected = useMemo(
    () => projectValue(baseYears[baseYears.length - 1], scenario, scenarioMap[scenario]),
    [baseYears, scenario, scenarioMap]
  );

  const trendData = useMemo(() => [...baseYears, projected], [baseYears, projected]);

  const revenueDelta =
    ((projected.revenue - baseYears[4].revenue) / baseYears[4].revenue) * 100;

  const sanityChecks = useMemo(() => {
    const baseline = projectValue(baseYears[4], "Baseline", scenarioMap.Baseline);
    const tactical = projectValue(baseYears[4], "Tactical", scenarioMap.Tactical);
    const aggressive = projectValue(
      baseYears[4],
      "Aggressive",
      scenarioMap.Aggressive
    );

    return [
      baseline.year === "2026-27",
      baseline.attendance < tactical.attendance,
      tactical.attendance < aggressive.attendance,
      baseline.revenue < tactical.revenue,
      tactical.revenue < aggressive.revenue,
      baseline.capPct > 0 && baseline.capPct < 100,
      formatMoney(13.4) === "$13.4M",
      formatMoney(1200) === "$1.2B",
      formatPercent(15.2) === "15.2%",
      buildLinePath([1, 2, 3], 300, 120, 16).startsWith("M"),
    ].every(Boolean);
  }, [baseYears, scenarioMap]);

  const KpiCard = ({
    title,
    value,
    sub,
  }: {
    title: string;
    value: string;
    sub: string;
  }) => (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
        {title}
      </div>
      <div className="mt-3 text-4xl font-black tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-white/65">{sub}</div>
    </div>
  );

  const SectionCard = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
      <div className="text-lg font-bold">{title}</div>
      <div className="mt-2 text-sm leading-6 text-white/65">{subtitle}</div>
      <div className="mt-5">{children}</div>
    </div>
  );

  const SimpleLineChart = ({
    labels,
    series,
  }: {
    labels: string[];
    series: { label: string; color: string; values: number[] }[];
  }) => {
    const width = 720;
    const height = 280;
    const padding = 24;

    return (
      <div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[280px] w-full overflow-visible rounded-2xl bg-black/20"
        >
          {[0, 1, 2, 3].map((i) => {
            const y = padding + ((height - padding * 2) / 3) * i;
            return (
              <line
                key={i}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
            );
          })}

          {series.map((item) => (
            <path
              key={item.label}
              d={buildLinePath(item.values, width, height, padding)}
              fill="none"
              stroke={item.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {labels.map((label, index) => {
            const x =
              padding +
              (labels.length === 1
                ? 0
                : (index / (labels.length - 1)) * (width - padding * 2));
            return (
              <text
                key={label}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize="12"
              >
                {label}
              </text>
            );
          })}
        </svg>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/65">
          {series.map((item) => (
            <div
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimpleBars = ({
    items,
  }: {
    items: { label: string; value: number; color: string }[];
  }) => {
    const max = Math.max(...items.map((item) => item.value));

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-white/80">{item.label}</span>
              <span className="font-semibold text-white">
                {item.value.toFixed(1)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#141414] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(252,76,2,.10), transparent 18%), radial-gradient(circle at 85% 10%, rgba(0,33,71,.25), transparent 22%), linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01))",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {!sanityChecks && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Internal model checks failed. Review scenario math and formatter
            helpers.
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FC4C02]/30 bg-[#FC4C02]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd5c6]">
              Interactive executive growth system
            </div>

            <h1 className="mb-3 text-4xl font-black tracking-tight md:text-5xl">
              San Diego Gulls
              <br />
              Interactive Command Dashboard
            </h1>

            <p className="max-w-3xl text-sm leading-6 text-white/70 md:text-base">
              A portfolio-grade front-office dashboard built to diagnose growth
              constraints, surface operational gaps, and model how better
              parking, smarter ticketing, stronger CRM, sharper marketing, and
              tighter execution can lift attendance, revenue, and brand value.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(["overview", "recon", "issues", "action"] as Tab[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                    tab === key
                      ? "border-[#FC4C02]/40 bg-[#FC4C02] text-white"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {key === "recon"
                    ? "Market Recon"
                    : key === "issues"
                    ? "Issue Tracker"
                    : key === "action"
                    ? "Action Plan"
                    : "Overview"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f1115]/95 p-6 shadow-2xl">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Scenario control
            </div>
            <div className="mb-4 text-2xl font-bold">Live growth switch</div>

            <div className="grid gap-3">
              {(["Baseline", "Tactical", "Aggressive"] as Scenario[]).map(
                (name) => (
                  <button
                    key={name}
                    onClick={() => setScenario(name)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      scenario === name
                        ? "border-[#FC4C02]/50 bg-[#FC4C02]/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{name}</span>
                      <span className="text-white/50">→</span>
                    </div>

                    <div className="mt-1 text-sm text-white/60">
                      {name === "Baseline" &&
                        "Conservative planning posture with modest lift across pricing, demand, and digital."}
                      {name === "Tactical" &&
                        "Most compelling executive story: realistic upside from better execution and packaging."}
                      {name === "Aggressive" &&
                        "A stretch case showing what happens if the organization executes like a top-tier commercial operation."}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Projected FY27 Revenue"
            value={formatMoney(projected.revenue)}
            sub={`vs FY26: +${formatPercent(revenueDelta)}`}
          />
          <KpiCard
            title="EBITDA Margin"
            value={formatPercent(projected.ebitdaMargin)}
            sub={`Projected EBITDA: ${formatMoney(projected.ebitda)}`}
          />
          <KpiCard
            title="Implied Franchise Value"
            value={formatMoney(projected.valuation)}
            sub="3.2x modeled revenue multiple"
          />
          <KpiCard
            title="Attendance Capacity %"
            value={formatPercent(projected.capPct)}
            sub={`${projected.attendance.toLocaleString()} avg fans / 12,920 capacity`}
          />
        </div>

        {tab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
            <SectionCard
              title="Attendance and revenue trajectory"
              subtitle="Historical trend plus live FY27 scenario modeling. This is the board-room view of how demand and monetization move together."
            >
              <SimpleLineChart
                labels={trendData.map((item) => item.year)}
                series={[
                  {
                    label: "Attendance",
                    color: "#FC4C02",
                    values: trendData.map((item) => item.attendance),
                  },
                  {
                    label: "Revenue ($M)",
                    color: "#60A5FA",
                    values: trendData.map((item) => item.revenue),
                  },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="Executive growth readout"
              subtitle="The Gulls do not need a miracle. They need tighter monetization, less friction, and a cleaner retention machine."
            >
              <div className="grid gap-3">
                {[
                  [
                    "Ticket yield",
                    `${projected.watp.toFixed(1)} modeled WATP`,
                    "Opportunity to raise yield without needing a new building first.",
                  ],
                  [
                    "Sponsorship",
                    `${formatMoney(projected.sponsorship)} FY27`,
                    "Inventory should be sold as measurable outcomes, not disconnected assets.",
                  ],
                  [
                    "Digital demand",
                    `${projected.digitalVisits.toFixed(1)}K visits`,
                    "Cleaner pages and stronger CRM can turn traffic into buyers faster.",
                  ],
                  [
                    "STM base",
                    `${projected.stmBase.toLocaleString()} members`,
                    "Retention and upsell are the real compounding engines.",
                  ],
                ].map(([title, value, blurb]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="font-semibold">{title}</div>
                    <div className="mt-1 text-sm text-[#ffbb9a]">{value}</div>
                    <div className="mt-2 text-sm leading-6 text-white/60">
                      {blurb}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Operational maturity view"
              subtitle="A fast visual read of where the organization can create business lift fastest."
            >
              <SimpleBars
                items={[
                  {
                    label: "Parking UX",
                    value: projected.parkingScore,
                    color: "#FC4C02",
                  },
                  {
                    label: "Game Ops",
                    value: projected.opsScore,
                    color: "#60A5FA",
                  },
                  {
                    label: "Digital Funnel",
                    value: projected.marketingScore,
                    color: "#34D399",
                  },
                  {
                    label: "Ticket Yield Readiness",
                    value:
                      scenario === "Aggressive"
                        ? 82
                        : scenario === "Tactical"
                        ? 78
                        : 74,
                    color: "#FBBF24",
                  },
                ]}
              />
            </SectionCard>

            <SectionCard
              title="Revenue mix logic"
              subtitle="The commercial story is broader than ticket sales alone. That is exactly where you can stand out."
            >
              <div className="grid gap-3">
                {[
                  ["Gate", "46%", "#FC4C02"],
                  ["Sponsorship", "20%", "#60A5FA"],
                  ["Ancillary", "17%", "#34D399"],
                  ["Parent Support", "14%", "#FBBF24"],
                  ["Other", "3%", "#A78BFA"],
                ].map(([name, share, color]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {name}
                    </div>
                    <div className="font-semibold text-white/80">{share}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {tab === "recon" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_.95fr]">
            <SectionCard
              title="Competitive ticketing recon"
              subtitle="A strategic benchmarking lens showing where the Gulls appear under-optimized relative to premium comps."
            >
              <SimpleBars items={benchmarkTeams} />
            </SectionCard>

            <SectionCard
              title="What this says operationally"
              subtitle="The Gulls’ opportunity is not just getting more fans. It is better monetization and better systems."
            >
              <div className="space-y-4">
                {actionPlan.map((item) => (
                  <div
                    key={item.move}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white">
                        {item.pillar}
                      </div>
                      <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        {item.lift}
                      </div>
                    </div>
                    <div className="font-semibold">{item.move}</div>
                    <div className="mt-2 text-sm leading-6 text-white/60">
                      {item.why}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {tab === "issues" && (
          <SectionCard
            title="Issue tracker and fault map"
            subtitle="This is the part that makes you look hireable: not just charts, but a structured diagnosis with owners, impact, and fixes."
          >
            <div className="grid gap-4">
              {issueBacklog.map((issue) => (
                <div
                  key={issue.id}
                  className="grid gap-4 rounded-[22px] border border-white/10 bg-[#0f1115]/95 p-5 md:grid-cols-[1.2fr_.6fr]"
                >
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${metricTone(
                          issue.severity
                        )}`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                        #{issue.id}
                      </span>
                    </div>
                    <div className="text-xl font-bold">{issue.title}</div>
                    <div className="mt-3 text-sm leading-6 text-white/65">
                      {issue.action}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                      Owner
                    </div>
                    <div className="mt-1 font-semibold">{issue.owner}</div>
                    <div className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                      Strategic impact
                    </div>
                    <div className="mt-1 text-sm leading-6 text-white/65">
                      {issue.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === "action" && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <SectionCard
              title="90-day executive action stack"
              subtitle="What leadership could actually do next quarter to produce measurable lift."
            >
              <div className="space-y-4">
                {[
                  {
                    phase: "Days 1–30",
                    bullets: [
                      "Fix stale ticketing pages and season references across public site architecture.",
                      "Map the full purchase flow from homepage to checkout to identify friction points.",
                      "Stand up a simple performance dashboard for attendance, WATP, repeat rate, and source-based conversion.",
                    ],
                  },
                  {
                    phase: "Days 31–60",
                    bullets: [
                      "Launch parking-prep emails and app reminders tied to ticket purchases.",
                      "Create promo-night follow-up journeys for second-game and mini-plan conversion.",
                      "Package bar-network and military nights as measured acquisition programs, not just activations.",
                    ],
                  },
                  {
                    phase: "Days 61–90",
                    bullets: [
                      "Test segmented pricing and offer ladders by weekday, opponent, and theme-night type.",
                      "Roll sponsor packages that blend digital, watch-party, tailgate, and hospitality inventory.",
                      "Create executive reporting around operational lift, not just campaign outputs.",
                    ],
                  },
                ].map((phase) => (
                  <div
                    key={phase.phase}
                    className="rounded-[22px] border border-white/10 bg-[#0f1115]/95 p-5"
                  >
                    <div className="mb-3 inline-flex rounded-full bg-[#002147]/55 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                      {phase.phase}
                    </div>
                    <div className="space-y-3 text-sm leading-6 text-white/70">
                      {phase.bullets.map((bullet) => (
                        <div key={bullet} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Why this gets attention"
              subtitle="Because it proves you can think like an operator, marketer, analyst, and builder at the same time."
            >
              <div className="space-y-4">
                {[
                  [
                    "Credible",
                    "It separates public anchors from modeled estimates instead of pretending to know private ledger data.",
                  ],
                  [
                    "Actionable",
                    "Every major issue has an owner, business impact, and next move.",
                  ],
                  [
                    "Localized",
                    "It treats San Diego’s military population, parking reality, and neighborhood behavior as strategic inputs.",
                  ],
                  [
                    "Commercial",
                    "It does not stop at fan engagement. It ties attention to revenue, yield, and retention.",
                  ],
                ].map(([title, copy]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="font-semibold">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-white/60">
                      {copy}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
