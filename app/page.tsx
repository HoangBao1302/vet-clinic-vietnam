import { redirect } from 'next/navigation';

// Root redirect to default locale (Vietnamese)
export default function RootPage() {
  redirect('/vi');
}

