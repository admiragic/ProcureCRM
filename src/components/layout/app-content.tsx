
'use client';

import { useAuth } from '@/context/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';

/**
 * This component acts as the main content wrapper for the application.
 * It determines whether to show the main app layout (sidebar, header, content)
 * or the login page based on the user's authentication status.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page content to be rendered.
 * @returns {React.ReactElement} The rendered application content.
 */
export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  /**
   * Effect to handle redirection based on authentication status.
   * If the auth check is complete (`!loading`) and there is no user,
   * it redirects to the login page.
   */
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  /**
   * While the authentication status is being checked, show a loading screen.
   */
  if (loading) {
     return (
      <div className="flex items-center justify-center min-h-screen">
        {t('login_page.loading')}
      </div>
    );
  }

  /**
   * If the user is not logged in, render the children directly.
   * In the case of a protected route, this will be the login page
   * due to the redirection logic above.
   */
  if (!user) {
    return <>{children}</>;
  }

  /**
   * If the user is logged in, render the full application layout
   * with the sidebar, header, and the main page content.
   */
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
