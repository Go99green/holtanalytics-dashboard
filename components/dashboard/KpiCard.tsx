import { formatCompact, formatPercent } from '@/lib/dashboard/formatters';
import type { KPI } from '@/lib/dashboard/transform';

export function KpiCard({ item }: { item: KPI }) {
  const upGood = item.inverseGood ? item.delta < 0 : item.delta > 0;
  return <div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4 shadow-lg shadow-black/25"><p className="text-xs uppercase tracking-wide text-[#8da2b0]">{item.label}</p><p className="mt-2 text-3xl font-bold text-white">{formatCompact(item.value)}</p><span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${upGood?'bg-emerald-500/20 text-emerald-300':'bg-rose-500/20 text-rose-300'}`}>{item.delta>=0?'↑':'↓'} {formatPercent(Math.abs(item.delta))} vs prior</span><p className="mt-2 text-xs text-[#9fb3c0]">{item.note}</p></div>;
}
