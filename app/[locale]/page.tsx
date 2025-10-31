import HomeClient from "./page-client";

const locales = ['vi', 'en'] as const;

// Generate static params for locales - must be in server component
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home() {
  return <HomeClient />;
} 