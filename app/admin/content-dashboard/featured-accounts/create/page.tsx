"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Star } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import type { FeaturedAccount } from "@/data/featuredAccounts";

export default function CreateFeaturedAccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<FeaturedAccount, 'id'>>({
    name: "",
    platform: "MQL5",
    broker: "",
    gain: "",
    drawdown: "",
    days: "",
    link: "",
    copyable: false,
    active: true,
    order: 1
  });

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/login?redirect=/admin/content-dashboard/featured-accounts/create");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.broker || !formData.link) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to save featured account
      console.log("Saving featured account:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Tạo featured account thành công!");
      router.push("/admin/content-dashboard");
    } catch (error) {
      console.error("Error creating featured account:", error);
      alert("Có lỗi xảy ra khi tạo featured account!");
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
                    Tạo Featured Account Mới
                  </h1>
                  <p className="text-gray-600 mt-1">Thêm featured account hiển thị trên homepage</p>
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
                  placeholder="Ví dụ: ThebenchmarkTrader Live #1"
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
                  placeholder="Ví dụ: Tickmill"
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
                  placeholder="https://..."
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
                  placeholder="+4359%"
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
                  placeholder="28.5%"
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
                  placeholder="1638"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order (Thứ tự hiển thị)
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
                  Copyable (Có thể copy trading)
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
                  Active (Hiển thị trên homepage)
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
                {loading ? "Đang lưu..." : "Lưu Featured Account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

