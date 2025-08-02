
'use client';

import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { DataProvider } from "@/context/data-context";
import { AppContent } from "@/components/layout/app-content";

/**
 * A component that wraps the entire application with all necessary context providers.
 * This ensures that all components have access to authentication, language, and data contexts.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the providers.
 * @returns {React.ReactElement} The rendered providers component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // The order of providers can be important if one context depends on another.
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          {/* AppContent handles the main layout and routing logic based on auth state */}
          <AppContent>{children}</AppContent>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
