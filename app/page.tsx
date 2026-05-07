"use client";

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SidebarNav, type ViewKey } from '@/components/dashboard/SidebarNav';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/dashboard/formatters';
import { buildDashboardViewModel } from '@/lib/dashboard/transform';

export default function Page() {
  const vm = useMemo(() => buildDashboardViewModel(), []);
  const [view, setView] = useState<ViewKey>('overview');
  const maxRep = Math.max(...vm.leaderboard.map((r) => r.value), 1);
  return (
    <AppShell sidebar={<SidebarNav view={view} onChange={setView} />} header={<DashboardHeader timestamp={vm.generatedAt} />}>
      {view === 'overview' && <section className="grid gap-4"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{vm.kpis.map((item) => <KpiCard key={item.label} item={item} />)}</div>
      <div className="grid gap-4 xl:grid-cols-3"><div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4 xl:col-span-2"><h2 className="mb-3 font-semibold">Monthly Full Season New (Qty + Revenue)</h2><div className="space-y-3">{vm.monthly.map((m) => <div key={m.month}><div className="mb-1 flex justify-between text-xs text-[#9fb3c0]"><span>{m.month}</span><span>{formatNumber(m.quantity)} tix · {formatCurrency(m.revenue)}</span></div><div className="h-2 rounded bg-[#18222c]"><div className="h-2 rounded bg-[#fc4c02]" style={{ width: `${Math.min(100, (m.quantity / Math.max(...vm.monthly.map((v) => v.quantity))) * 100)}%` }} /></div></div>)}</div></div>
      <div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4"><h2 className="font-semibold">Executive Brief</h2><ul className="mt-3 space-y-2 text-sm text-[#c5d3dd]"><li>• Highest revenue game: {vm.events[0]?.event}</li><li>• Best rep by modeled output: {vm.leaderboard[0]?.rep}</li><li>• Outstanding balance risk: {formatCurrency(vm.kpis[3].value)}</li><li>• Revenue pace variance: {formatPercent(vm.kpis[0].delta)}</li></ul></div></div></section>}
      {view === 'pacing' && <section className="grid gap-4 xl:grid-cols-2"><div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4"><h2 className="mb-4 font-semibold">Rep Leaderboard</h2>{vm.leaderboard.map((rep) => <div key={rep.rank} className="mb-3"><div className="mb-1 flex justify-between text-sm"><span>#{rep.rank} {rep.rep}</span><span>{formatCurrency(rep.value)}</span></div><div className="h-2 rounded bg-[#18222c]"><div className="h-2 rounded bg-[#0088ce]" style={{ width: `${(rep.value / maxRep) * 100}%` }} /></div></div>)}</div><div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4"><h2 className="mb-4 font-semibold">Top Games by Revenue (deduped by event record)</h2>{vm.events.map((event, i) => <div key={event.event+i} className="mb-2 flex items-center justify-between rounded-lg bg-[#111a22] p-2 text-sm"><span>{i + 1}. {event.event}</span><span>{formatCurrency(event.revenue)} · {formatNumber(event.tickets)} tix</span></div>)}</div></section>}
      {view === 'admin' && <section className="grid gap-4 xl:grid-cols-3"><div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4"><h2 className="font-semibold">Data Quality Trust Panel</h2><p className="mt-2 text-sm text-emerald-300">● Ticket Lines Loaded</p><p className="text-sm text-emerald-300">● Orders Loaded</p><p className="text-sm text-yellow-300">● Blank Order IDs: Monitor</p></div><div className="rounded-2xl border border-[#1d2b36] bg-[#0f161d] p-4 xl:col-span-2"><h2 className="font-semibold">Accuracy Audit (Legacy Corrections)</h2><p className="mt-2 text-sm text-[#c5d3dd]">Legacy formula references were replaced by clean DASH_EXPORT values for trusted totals. Dashboard is using clean values and keeping parity notes visible.</p></div></section>}
    </AppShell>
  );
}
