"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import viTranslations from '@/locales/vi.json';
import enTranslations from '@/locales/en.json';

type Locale = 'vi' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Record<string, any>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  vi: viTranslations,
  en: enTranslations,
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');
  const [isClient, setIsClient] = useState(false);

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'vi' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (isClient) {
      localStorage.setItem('locale', newLocale);
    }
  };

  // Translation function with nested key support (e.g., "nav.home")
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Vietnamese if key not found
        value = translations.vi;
        for (const fallbackK of keys) {
          if (value && typeof value === 'object' && fallbackK in value) {
            value = value[fallbackK];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, translations: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

