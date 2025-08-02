
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/app/providers";

/**
 * Metadata for the application, used for SEO and browser tab information.
 */
export const metadata: Metadata = {
  title: "ProcureCRM",
  description: "A lightweight CRM for simple procurement.",
};

// Configuration for the Inter font from Google Fonts.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // CSS variable for easy use in Tailwind
});

// Configuration for the Space Grotesk font.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Configuration for the Source Code Pro font.
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

/**
 * The root layout component for the entire application.
 * It wraps all pages and provides a consistent structure, including fonts and providers.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} The rendered root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Link to the specific Google Fonts used in the application */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          inter.variable,
          spaceGrotesk.variable,
          sourceCodePro.variable
        )}
      >
        {/* The Providers component wraps the app in all necessary context providers (Auth, Language, Data) */}
        <Providers>
          {children}
        </Providers>
        {/* The Toaster component is for displaying toast notifications */}
        <Toaster />
      </body>
    </html>
  );
}
