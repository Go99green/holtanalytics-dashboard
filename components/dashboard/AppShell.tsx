import type { ReactNode } from 'react';

export function AppShell({ sidebar, header, children }: { sidebar: ReactNode; header: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070a0d] text-[#e8eff4]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 p-4 lg:grid-cols-[250px_1fr]">
        <aside>{sidebar}</aside>
        <main className="space-y-4">{header}{children}</main>
      </div>
    </div>
  );
}
