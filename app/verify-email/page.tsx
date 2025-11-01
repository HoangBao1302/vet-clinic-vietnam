'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [autoRedirect, setAutoRedirect] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token không hợp lệ');
      return;
    }

    // Verify email with retry logic
    const verifyEmail = async (attempt = 0) => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email đã được xác thực thành công!');
          
          // Auto-login if token provided
          if (data.token && data.user) {
            login(data.token, data.user);
            setAutoRedirect(true);
            
            // Redirect after 2 seconds (faster)
            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        } else {
          // Check if already verified (user clicked link multiple times)
          if (data.alreadyVerified) {
            setStatus('success');
            setMessage('Email đã được xác thực trước đó! Đang tự động đăng nhập...');
            
            // Auto-login if token provided (even for already verified)
            if (data.token && data.user) {
              login(data.token, data.user);
              setAutoRedirect(true);
              setTimeout(() => {
                router.push('/');
              }, 2000);
            } else {
              // Fallback: redirect to login
              setTimeout(() => {
                router.push('/login?verified=true');
              }, 3000);
            }
            return;
          }

          // Retry logic for transient errors (network, DB connection)
          if (attempt < 2 && (res.status >= 500 || res.status === 0)) {
            console.log(`Retry attempt ${attempt + 1}...`);
            setRetryCount(attempt + 1);
            setTimeout(() => {
              verifyEmail(attempt + 1);
            }, 1000 * (attempt + 1)); // Exponential backoff: 1s, 2s
            return;
          }

          setStatus('error');
          setMessage(data.message || 'Xác thực email thất bại');
        }
      } catch (error) {
        console.error('Verify email error:', error);
        
        // Retry on network errors
        if (attempt < 2) {
          console.log(`Retry attempt ${attempt + 1} due to network error...`);
          setRetryCount(attempt + 1);
          setTimeout(() => {
            verifyEmail(attempt + 1);
          }, 1000 * (attempt + 1));
          return;
        }

        setStatus('error');
        setMessage('Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại sau.');
      }
    };

    verifyEmail();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {status === 'loading' && (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Đang xác thực...
                </h1>
                <p className="text-gray-600">
                  {retryCount > 0 
                    ? `Đang thử lại lần ${retryCount + 1}...` 
                    : 'Vui lòng chờ trong giây lát'}
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  ✅ Xác Thực Thành Công!
                </h1>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                
                {autoRedirect && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      Đang tự động đăng nhập và chuyển hướng...
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                  >
                    Về Trang Chủ
                  </Link>
                  <Link
                    href="/downloads"
                    className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Download EA Demo
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Xác Thực Thất Bại
                </h1>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    Đăng Ký Lại
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Đăng Nhập
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Đang tải...
                </h1>
                <p className="text-gray-600">
                  Vui lòng chờ trong giây lát
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

