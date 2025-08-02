
'use client';

import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { DataProvider } from "@/context/data-context";
import { AppContent } from "@/components/layout/app-content";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <AppContent>{children}</AppContent>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
