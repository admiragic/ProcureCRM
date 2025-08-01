
'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    if (pathname !== '/login') {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return null; 
    }
    return <>{children}</>;
  }

  if (pathname === '/login') {
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
