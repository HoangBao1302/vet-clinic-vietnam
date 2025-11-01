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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      // If we have auth data in localStorage, wait for context to initialize
      if (token && userData && !isAuthenticated && authLoading) {
        return;
      }
      
      // Only redirect if we have NO auth data AND context is ready and says not authenticated
      if (!token && !userData && isAuthenticated === false && !authLoading) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      
      // Context ready, we can proceed
      if (!authLoading) {
        setChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, authLoading, router, redirectTo]);

  // Show loading while checking auth
  if (checking || authLoading) {
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

