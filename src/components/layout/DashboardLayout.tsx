import type { ReactNode } from 'react';
import { GlassSidebar } from './GlassSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 overflow-hidden relative font-sans">
      
      <GlassSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto h-screen custom-scrollbar relative z-10">
        {children}
      </main>
    </div>
  );
}
