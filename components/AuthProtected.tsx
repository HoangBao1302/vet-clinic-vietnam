'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Loader2 } from 'lucide-react';

interface AuthProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthProtected({ children, redirectTo = '/login' }: AuthProtectedProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setChecking(false);
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading while checking auth
  if (checking || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (fallback)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

