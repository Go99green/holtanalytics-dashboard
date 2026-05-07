export function DashboardHeader({ timestamp }: { timestamp: string }) {
  return <header className="rounded-2xl border border-[#1b2a36] bg-gradient-to-r from-[#111a22] to-[#0b1117] p-4"><h1 className="text-xl font-semibold">Gulls Ticketing Command Center</h1><p className="text-sm text-[#9fb3c0]">Executive analytics cockpit · Last updated {new Date(timestamp).toLocaleString()}</p></header>;
}
