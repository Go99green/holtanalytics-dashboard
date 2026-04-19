import masterModel from "@/data/normalized/gulls.master-model.json";
import type { HistoricalAnchor } from "@/lib/types/dashboard";

const YEARS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"] as const;

const HISTORICAL_PUBLIC_KEYS = [
  "1_average_attendance",
  "2_home_games",
  "9_promotional_theme_nights",
  "12_stm_entry_price",
] as const;

function getMetricValue(fieldKey: string, year: (typeof YEARS)[number]) {
  const row = masterModel.find((metric) => metric.fieldKey === fieldKey);
  return row?.valuesByYear?.[year] ?? null;
}

export const historicalPublicAnchors: HistoricalAnchor[] = YEARS.map((year) => ({
  year,
  metrics: Object.fromEntries(
    HISTORICAL_PUBLIC_KEYS.map((key) => [key, getMetricValue(key, year)])
  ),
}));
