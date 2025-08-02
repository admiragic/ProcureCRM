
'use client';

import { useAuth } from '@/context/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect if loading is done and there's no user
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While checking auth state, show a loading screen
  if (loading) {
     return (
      <div className="flex items-center justify-center min-h-screen">
        {t('login_page.loading')}
      </div>
    );
  }

  // If not logged in, show the login page children (which is the login page itself)
  if (!user) {
    return <>{children}</>;
  }

  // If user is logged in, show the main app layout
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
