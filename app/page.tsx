import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

// Root redirect to default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

