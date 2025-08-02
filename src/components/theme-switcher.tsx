
'use client';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * A component that allows the user to toggle between light and dark themes.
 * @returns {React.ReactElement} The rendered theme switcher button.
 */
export function ThemeSwitcher() {
    // State to track the current theme mode.
    const [isDarkMode, setIsDarkMode] = useState(false);

    /**
     * Effect to set the initial state based on the class on the `<html>` element.
     * This runs once when the component mounts.
     */
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    /**
     * Toggles the theme by adding or removing the 'dark' class from the `<html>` element.
     * It also updates the local state to reflect the change.
     */
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}
