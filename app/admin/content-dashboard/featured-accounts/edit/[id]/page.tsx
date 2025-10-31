"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Star } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { featuredAccounts } from "@/data/featuredAccounts";
import type { FeaturedAccount } from "@/data/featuredAccounts";

export default function EditFeaturedAccountPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FeaturedAccount | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login?redirect=/admin/content-dashboard");
      return;
    }

    const accountId = params.id as string;
    const account = featuredAccounts.find(a => a.id === accountId);
    
    if (!account) {
      alert("Featured account không tồn tại!");
      router.push("/admin/content-dashboard");
      return;
    }

    setFormData(account);
  }, [params, isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin" || !formData) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData?.name || !formData?.broker || !formData?.link) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to update featured account
      console.log("Updating featured account:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Cập nhật featured account thành công!");
      router.push("/admin/content-dashboard");
    } catch (error) {
      console.error("Error updating featured account:", error);
      alert("Có lỗi xảy ra khi cập nhật featured account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Star className="text-yellow-600" size={32} />
                    Chỉnh Sửa: {formData.name}
                  </h1>
                  <p className="text-gray-600 mt-1">Cập nhật featured account trên homepage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Tài Khoản * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform * <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                >
                  <option value="MQL5">MQL5</option>
                  <option value="MQL4">MQL4</option>
                  <option value="Myfxbook">Myfxbook</option>
                  <option value="Tickmill Social">Tickmill Social</option>
                  <option value="PuPrime Social">PuPrime Social</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Broker * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.broker}
                  onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link * <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gain
                </label>
                <input
                  type="text"
                  value={formData.gain}
                  onChange={(e) => setFormData({ ...formData, gain: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drawdown
                </label>
                <input
                  type="text"
                  value={formData.drawdown}
                  onChange={(e) => setFormData({ ...formData, drawdown: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Days
                </label>
                <input
                  type="text"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="copyable"
                  checked={formData.copyable}
                  onChange={(e) => setFormData({ ...formData, copyable: e.target.checked })}
                  className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
                />
                <label htmlFor="copyable" className="ml-2 text-sm font-semibold text-gray-700">
                  Copyable
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
                />
                <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
                  Active
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Đang lưu..." : "Cập Nhật Featured Account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

