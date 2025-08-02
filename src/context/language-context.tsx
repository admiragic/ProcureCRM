
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hr from '@/locales/hr.json';
import pl from '@/locales/pl.json';

// A record object to hold all translation files, keyed by language code.
const translations: Record<string, any> = { en, hr, pl };

/**
 * Defines the shape of the language context.
 * @property {string} language - The current active language code (e.g., "en").
 * @property {(language: string) => void} setLanguage - Function to change the current language.
 * @property {(key: string, options?: Record<string, string | number>) => string} t - The translation function.
 */
type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

// Create the language context.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * The provider component for the language context.
 * It manages the current language and provides a translation function (`t`) to its children.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The rendered provider.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  /**
   * Effect to load the saved language from localStorage when the component mounts.
   */
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage);
    }
  }, []);

  /**
   * Handles changing the application's language.
   * It updates the state and persists the new language to localStorage.
   * @param {string} lang - The language code to set (e.g., "en", "hr").
   */
  const handleSetLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  /**
   * The translation function.
   * It takes a key (e.g., "sidebar.dashboard") and optional interpolation options.
   * It looks up the translation in the current language's JSON file.
   * If a key is not found, it falls back to English.
   * If still not found, it returns the key itself.
   * @param {string} key - The key for the translation string.
   * @param {Record<string, string | number>} [options] - Optional values for interpolation.
   * @returns {string} The translated and interpolated string.
   */
  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    const keys = key.split('.');
    let result = translations[language];
    // Traverse the JSON object to find the translation string.
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing in the current language.
        let fallbackResult = translations['en'];
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
          if (fallbackResult === undefined) {
            return key; // Return the key if no translation is found at all.
          }
        }
        result = fallbackResult;
        break;
      }
    }
    
    // Handle interpolation if options are provided (e.g., replacing {{name}}).
    if (typeof result === 'string' && options) {
        return Object.entries(options).reduce((acc, [key, value]) => {
            return acc.replace(`{{${key}}}`, String(value));
        }, result);
    }

    return result || key;
  }, [language]); // This function is memoized and re-created only when the language changes.

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * A custom hook to easily access the language context.
 * Throws an error if used outside of a LanguageProvider.
 * @returns {LanguageContextType} The language context.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
