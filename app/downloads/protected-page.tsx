"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, FileText, TrendingUp, CheckCircle, Lock, AlertCircle } from "lucide-react";

interface DownloadFile {
  id: string;
  name: string;
  type: 'ea-demo' | 'indicator' | 'ea-full';
  description: string;
  fileSize: string;
  version: string;
  filePath: string;
  isPremium: boolean;
}

const availableFiles: DownloadFile[] = [
  {
    id: 'ea-demo-1',
    name: 'EA Forex LeopardSmart Demo',
    type: 'ea-demo',
    description: 'Phiên bản demo với các tính năng cơ bản, giới hạn thời gian 30 ngày',
    fileSize: '2.5 MB',
    version: '1.0.0',
    filePath: '/downloads/files/ea-leopardsmart-demo.ex4',
    isPremium: false,
  },
  {
    id: 'indicator-1',
    name: 'Trend Indicator Pro',
    type: 'indicator',
    description: 'Indicator xác định xu hướng chính xác cao',
    fileSize: '1.2 MB',
    version: '2.1.0',
    filePath: '/downloads/files/trend-indicator-pro.ex4',
    isPremium: false,
  },
  {
    id: 'indicator-2',
    name: 'Support Resistance Indicator',
    type: 'indicator',
    description: 'Tự động vẽ vùng support và resistance',
    fileSize: '850 KB',
    version: '1.5.0',
    filePath: '/downloads/files/sr-indicator.ex4',
    isPremium: false,
  },
  {
    id: 'indicator-3',
    name: 'Volume Profile Indicator',
    type: 'indicator',
    description: 'Phân tích volume theo từng vùng giá',
    fileSize: '1.8 MB',
    version: '1.3.0',
    filePath: '/downloads/files/volume-profile.ex4',
    isPremium: false,
  },
];

export default function ProtectedDownloadsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [userDownloads, setUserDownloads] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/downloads');
      return;
    }

    // Fetch user download stats
    fetchDownloadStats();
  }, [isAuthenticated, router]);

  const fetchDownloadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/downloads/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDownloads(data);
      }
    } catch (err) {
      console.error('Failed to fetch download stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: DownloadFile) => {
    setDownloading(file.id);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/downloads/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileType: file.type,
          fileName: file.name,
          filePath: file.filePath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Download failed');
      }

      // Trigger actual download
      const link = document.createElement('a');
      link.href = file.filePath;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Refresh stats
      fetchDownloadStats();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const canDownload = (file: DownloadFile) => {
    if (!userDownloads) return false;
    
    if (file.type === 'ea-demo') {
      return userDownloads.downloadsThisMonth.eaDemo < 1;
    }
    
    if (file.type === 'indicator') {
      return userDownloads.downloadsThisMonth.indicators < 3;
    }
    
    return false;
  };

  const getDownloadLimitText = (type: string) => {
    if (!userDownloads) return '';
    
    if (type === 'ea-demo') {
      const used = userDownloads.downloadsThisMonth.eaDemo;
      return `${used}/1 lần download`;
    }
    
    if (type === 'indicator') {
      const used = userDownloads.downloadsThisMonth.indicators;
      return `${used}/3 lần download`;
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-20">
          <div className="container-custom text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-20">
        <div className="container-custom max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Downloads Miễn Phí
            </h1>
            <p className="text-lg text-gray-600">
              Tải về EA Demo và Indicators dành cho thành viên
            </p>
          </div>

          {/* User Stats */}
          {userDownloads && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-90">Membership Tier</div>
                  <div className="text-2xl font-bold capitalize">
                    {userDownloads.membershipTier}
                    {userDownloads.isPaid && ' 💎'}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90">EA Demo Downloads</div>
                  <div className="text-2xl font-bold">
                    {userDownloads.downloadsThisMonth.eaDemo} / 1
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Indicator Downloads</div>
                  <div className="text-2xl font-bold">
                    {userDownloads.downloadsThisMonth.indicators} / 3
                  </div>
                </div>
              </div>
              
              {!userDownloads.isPaid && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm">
                    💡 <strong>Upgrade to Paid Member</strong> để download unlimited và nhận thêm nhiều quyền lợi!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableFiles.map((file) => {
              const canDL = canDownload(file);
              const limitText = getDownloadLimitText(file.type);

              return (
                <div
                  key={file.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.type === 'ea-demo' ? (
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {file.name}
                        </h3>
                        {file.type === 'ea-demo' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            EA
                          </span>
                        )}
                        {file.type === 'indicator' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            Indicator
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {file.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span>📦 {file.fileSize}</span>
                        <span>🔢 v{file.version}</span>
                        <span>{limitText}</span>
                      </div>

                      {canDL ? (
                        <button
                          onClick={() => handleDownload(file)}
                          disabled={downloading === file.id}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {downloading === file.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <Download size={16} />
                              Download Miễn Phí
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock size={16} />
                          Đã hết lượt download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upgrade CTA */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Muốn Download Unlimited?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Upgrade lên Paid Member để:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle size={20} />
                <span>Unlimited downloads</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle size={20} />
                <span>Access EA Full Version</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle size={20} />
                <span>Premium content</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="px-8 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Xem Gói Thành Viên
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

