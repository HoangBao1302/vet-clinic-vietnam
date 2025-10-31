"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Plus, X, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { tradingAccounts } from "@/data/tradingAccounts";
import type { TradingAccount } from "@/data/tradingAccounts";

export default function EditTradingAccountPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TradingAccount | null>(null);
  const [highlightInput, setHighlightInput] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login?redirect=/admin/content-dashboard");
      return;
    }

    const accountId = params.id as string;
    const account = tradingAccounts.find(a => a.id === accountId);
    
    if (!account) {
      alert("Trading account không tồn tại!");
      router.push("/admin/content-dashboard");
      return;
    }

    setFormData(account);
  }, [params, isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin" || !formData) {
    return null;
  }

  const handleAddHighlight = () => {
    if (highlightInput.trim() && formData) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()]
      });
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData?.accountName || !formData?.broker || !formData?.accountNumber) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to update trading account
      console.log("Updating trading account:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Cập nhật trading account thành công!");
      router.push("/admin/content-dashboard");
    } catch (error) {
      console.error("Error updating trading account:", error);
      alert("Có lỗi xảy ra khi cập nhật trading account!");
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
                    <TrendingUp className="text-green-600" size={32} />
                    Chỉnh Sửa: {formData.accountName}
                  </h1>
                  <p className="text-gray-600 mt-1">Cập nhật thông tin trading account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Same as Create but with formData loaded */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Thông Tin Cơ Bản</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Tài Khoản * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số Tài Khoản * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <label htmlFor="verified" className="ml-2 text-sm font-semibold text-gray-700">
                    Verified Account
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h2 className="text-xl font-bold">Thống Kê</h2>
              
              <div className="grid md:grid-cols-5 gap-4">
                {(["gain", "drawdown", "winRate", "profitFactor", "tradingDays"] as const).map((statKey) => (
                  <div key={statKey}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {statKey === "winRate" ? "Win Rate" : statKey === "profitFactor" ? "Profit Factor" : statKey === "tradingDays" ? "Trading Days" : statKey}
                    </label>
                    <input
                      type="text"
                      value={formData.stats[statKey]}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stats: { ...formData.stats, [statKey]: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h2 className="text-xl font-bold">Links</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {(["profile", "copyTrade", "youtube"] as const).map((linkKey) => (
                  <div key={linkKey}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {linkKey === "copyTrade" ? "Copy Trade Link" : linkKey === "youtube" ? "YouTube Link" : "Profile Link"}
                    </label>
                    <input
                      type="url"
                      value={formData.links[linkKey] || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        links: { ...formData.links, [linkKey]: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô Tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Highlights */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Điểm Nổi Bật</h2>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Thêm điểm nổi bật..."
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Thêm
                </button>
              </div>

              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-1 text-sm">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Đang lưu..." : "Cập Nhật Trading Account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

