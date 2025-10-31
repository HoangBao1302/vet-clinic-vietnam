"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Plus, X, Building2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import type { PartnerInfo } from "@/data/partners";

export default function CreatePartnerPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<PartnerInfo, 'id'>>({
    name: "",
    logo: "",
    website: "",
    rating: 4.0,
    active: true,
    order: 1,
    spread: [],
    license: [],
    deposit: [],
    support: [],
    notes: []
  });
  const [currentList, setCurrentList] = useState<"spread" | "license" | "deposit" | "support" | "notes">("spread");
  const [listItemInput, setListItemInput] = useState("");

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/login?redirect=/admin/content-dashboard/partners/create");
    return null;
  }

  const handleAddListItem = () => {
    if (listItemInput.trim()) {
      setFormData({
        ...formData,
        [currentList]: [...formData[currentList], listItemInput.trim()]
      });
      setListItemInput("");
    }
  };

  const handleRemoveListItem = (listType: typeof currentList, index: number) => {
    setFormData({
      ...formData,
      [listType]: formData[listType].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.website) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Website)!");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to save partner
      console.log("Saving partner:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Tạo partner thành công!");
      router.push("/admin/content-dashboard");
    } catch (error) {
      console.error("Error creating partner:", error);
      alert("Có lỗi xảy ra khi tạo partner!");
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
                    <Building2 className="text-blue-600" size={32} />
                    Tạo Partner Mới
                  </h1>
                  <p className="text-gray-600 mt-1">Thêm broker partner mới vào hệ thống</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Partner * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: Tickmill"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website * <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo || ""}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
                  Active (Hiển thị trên website)
                </label>
              </div>
            </div>

            {/* Lists Management */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Quản lý Danh Sách</h2>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
                {(["spread", "license", "deposit", "support", "notes"] as const).map((listType) => (
                  <button
                    key={listType}
                    type="button"
                    onClick={() => setCurrentList(listType)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      currentList === listType
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {listType === "spread" && "Spread & Phí"}
                    {listType === "license" && "Giấy Phép"}
                    {listType === "deposit" && "Nạp & Rút"}
                    {listType === "support" && "Hỗ Trợ"}
                    {listType === "notes" && "Lưu Ý"}
                  </button>
                ))}
              </div>

              {/* Add Item */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={listItemInput}
                  onChange={(e) => setListItemInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddListItem())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Thêm item mới cho ${currentList}...`}
                />
                <button
                  type="button"
                  onClick={handleAddListItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Thêm
                </button>
              </div>

              {/* List Items */}
              <div className="space-y-2">
                {formData[currentList].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-1 text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(currentList, index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {formData[currentList].length === 0 && (
                  <p className="text-gray-500 text-sm italic">Chưa có item nào. Hãy thêm item mới!</p>
                )}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Đang lưu..." : "Lưu Partner"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

