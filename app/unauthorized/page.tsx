"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                🚫 Truy Cập Bị Từ Chối
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Bạn không có quyền truy cập vào trang này. 
                Chỉ có quản trị viên mới có thể truy cập các trang admin.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Lưu ý:</strong> Nếu bạn là quản trị viên, hãy đảm bảo bạn đã đăng nhập với tài khoản admin.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Về Trang Chủ
                </a>
                
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Quay Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
