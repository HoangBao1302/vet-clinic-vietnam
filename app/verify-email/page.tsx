'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [autoRedirect, setAutoRedirect] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token không hợp lệ');
      return;
    }

    // Verify email
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        
        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email đã được xác thực thành công!');
          
          // Auto-login if token provided
          if (data.token && data.user) {
            login(data.token, data.user);
            setAutoRedirect(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
              router.push('/');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác thực email thất bại');
        }
      })
      .catch((error) => {
        console.error('Verify email error:', error);
        setStatus('error');
        setMessage('Đã xảy ra lỗi khi xác thực email');
      });
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
                  Vui lòng chờ trong giây lát
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

