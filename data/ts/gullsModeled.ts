import masterModel from "@/data/normalized/gulls.master-model.json";
import type { ModeledMetricSeries } from "@/lib/types/dashboard";

const modeledStatuses = new Set(["estimate", "estimate_projection", "derived"]);

export const modeledEstimates: ModeledMetricSeries[] = masterModel
  .filter((metric) => modeledStatuses.has(metric.normalizedStatus))
  .map((metric) => ({
    fieldKey: metric.fieldKey,
    fieldLabel: metric.fieldLabel,
    valuesByYear: metric.valuesByYear,
  }));
