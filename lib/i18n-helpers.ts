import { useLocale } from 'next-intl';

/**
 * Helper function to generate localized links
 * Usage: useLocalizedLink('/pricing') → '/vi/pricing' or '/en/pricing'
 */
export function useLocalizedLink(path: string): string {
  const locale = useLocale();
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path is already a full URL or starts with http, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path is just '/', return locale root
  if (path === '/' || cleanPath === '') {
    return `/${locale}`;
  }
  
  // Admin routes and other protected routes should not have locale prefix
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/affiliate') ||
    path.startsWith('/profile') ||
    path.startsWith('/login') ||
    path.startsWith('/register')
  ) {
    return path;
  }
  
  return `/${locale}/${cleanPath}`;
}

/**
 * Server-side helper for localized links
 */
export function getLocalizedLink(path: string, locale: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path === '/' || cleanPath === '') {
    return `/${locale}`;
  }
  
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/affiliate') ||
    path.startsWith('/profile') ||
    path.startsWith('/login') ||
    path.startsWith('/register')
  ) {
    return path;
  }
  
  return `/${locale}/${cleanPath}`;
}

