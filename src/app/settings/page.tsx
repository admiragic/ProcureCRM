
'use client';

import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

   useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

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
