export const issueBacklog = [
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
    impact: "Good single-game turnout without enough second-game conversion",
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
] as const;

export const issuesDataSource =
  "Phase 1 temporary hardcoded module; planned workbook-driven migration in Phase 2." as const;
