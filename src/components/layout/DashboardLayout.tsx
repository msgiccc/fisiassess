import { ReactNode } from 'react';
import { GlassSidebar } from './GlassSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 flex text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hero-glow rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <GlassSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto h-screen custom-scrollbar relative z-10">
        {children}
      </main>
    </div>
  );
}
