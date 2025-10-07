"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Mail, Send, Users, TrendingUp, Calendar, 
  Eye, Edit, Trash2, Plus, BarChart3 
} from "lucide-react";

interface NewsletterCampaign {
  id: string;
  title: string;
  content: string;
  subject: string;
  sentAt?: Date;
  subscribers: number;
  openRate: number;
  clickRate: number;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: Date;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  username: string;
  subscribedAt: Date;
  isActive: boolean;
}

export default function NewsletterAdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'analytics'>('campaigns');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login?redirect=/admin/newsletter');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      // Fetch campaigns and subscribers
      const [campaignsRes, subscribersRes] = await Promise.all([
        fetch('/api/admin/newsletter/campaigns', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/newsletter/subscribers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        setSubscribers(subscribersData.subscribers || []);
      }
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async (campaignId: string) => {
    try {
      const response = await fetch('/api/admin/newsletter/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ campaignId })
      });

      if (response.ok) {
        alert('Email test đã được gửi!');
      } else {
        alert('Có lỗi xảy ra khi gửi email test');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Có lỗi xảy ra khi gửi email test');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="text-blue-600" size={32} />
                Quản Lý Newsletter
              </h1>
              <p className="text-gray-600 mt-2">
                Tạo và gửi newsletter cho premium users
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={20} />
              Tạo Campaign
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Campaigns Đã Gửi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'sent').length}
                  </p>
                </div>
                <Send className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Rate TB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.length > 0 ? 
                      Math.round(campaigns.reduce((acc, c) => acc + c.openRate, 0) / campaigns.length) : 
                      0
                    }%
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Click Rate TB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.length > 0 ? 
                      Math.round(campaigns.reduce((acc, c) => acc + c.clickRate, 0) / campaigns.length) : 
                      0
                    }%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'campaigns', label: 'Campaigns', icon: Send },
                  { id: 'subscribers', label: 'Subscribers', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Newsletter Campaigns</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Plus size={16} />
                      Tạo Mới
                    </button>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có campaign nào</h3>
                      <p className="text-gray-600 mb-4">Tạo campaign đầu tiên để gửi newsletter</p>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Tạo Campaign
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {campaigns.map((campaign) => (
                        <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{campaign.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                  campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {campaign.status === 'sent' ? 'Đã gửi' :
                                   campaign.status === 'scheduled' ? 'Đã lên lịch' : 'Nháp'}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-4">{campaign.subject}</p>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Subscribers:</span>
                                  <span className="font-medium ml-2">{campaign.subscribers}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Open Rate:</span>
                                  <span className="font-medium ml-2">{campaign.openRate}%</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Click Rate:</span>
                                  <span className="font-medium ml-2">{campaign.clickRate}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button 
                                onClick={() => sendTestEmail(campaign.id)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Gửi test email"
                              >
                                <Send size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Premium Subscribers</h3>
                    <div className="text-sm text-gray-600">
                      Tổng: {subscribers.length} subscribers
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày đăng ký
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {subscriber.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(subscriber.subscribedAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {subscriber.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">Analytics</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Subscriber Growth</h4>
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                        <p>Biểu đồ tăng trưởng subscribers</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Email Performance</h4>
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                        <p>Hiệu suất email campaigns</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
