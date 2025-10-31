import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Supported locales - export from routing for consistency
export const locales = routing.locales;
export type Locale = (typeof routing.locales)[number];

// Default locale
export const defaultLocale = routing.defaultLocale;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

