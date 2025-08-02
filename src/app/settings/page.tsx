
'use client';

import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';

/**
 * The settings page component.
 * It allows users to customize their application experience, such as changing the theme.
 * @returns {React.ReactElement} The rendered settings page.
 */
export default function SettingsPage() {
  const { t } = useLanguage();
  // State to track whether dark mode is currently enabled.
  const [isDarkMode, setIsDarkMode] = useState(false);

   /**
    * Effect to check the initial theme preference when the component mounts.
    * It checks if the 'dark' class is present on the `<html>` element.
    */
   useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    /**
     * Toggles the application theme between light and dark mode.
     * It adds or removes the 'dark' class from the `<html>` element.
     */
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

  return (
    <>
      <PageHeader
        title={t('user_nav.settings')}
        description="Customize your application experience."
      />
       <Card className="max-w-2xl">
        <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Adjust the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">
                        Enable dark theme for a different visual experience.
                    </p>
                </div>
                <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleTheme}
                />
            </div>
        </CardContent>
      </Card>
    </>
  );
}
