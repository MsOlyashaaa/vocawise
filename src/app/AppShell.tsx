import type { ReactNode } from 'react';
import { BottomNav } from '@components/BottomNav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
