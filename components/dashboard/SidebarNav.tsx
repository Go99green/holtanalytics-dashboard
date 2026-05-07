export type ViewKey = 'overview' | 'pacing' | 'admin';
export function SidebarNav({ view, onChange }: { view: ViewKey; onChange: (v: ViewKey) => void }) {
  const items: { key: ViewKey; label: string; sub: string }[] = [
    { key: 'overview', label: 'Sales Overview', sub: 'KPIs · Mix · Monthly' },
    { key: 'pacing', label: 'Pacing & Leaderboards', sub: 'Reps · Events · Pace' },
    { key: 'admin', label: 'Data Quality / Admin', sub: 'Trust · Audit · Notes' },
  ];
  return <div className="rounded-2xl border border-[#1b2a36] bg-[#0d1319] p-3">{items.map((item) => <button key={item.key} onClick={() => onChange(item.key)} className={`mb-2 w-full rounded-xl border p-3 text-left ${view===item.key?'border-[#fc4c02] bg-[#fc4c02]/10':'border-[#1f2e3a] bg-[#0a1015] hover:border-[#0088ce]'}`}><div className="text-sm font-semibold">{item.label}</div><div className="text-xs text-[#9fb3c0]">{item.sub}</div></button>)}</div>;
}
