"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Star,
  Package,
  DollarSign,
  Loader,
  Info,
  Settings,
} from "lucide-react";
import { IProduct } from "@/types/product";

interface FormData {
  id: string;
  name: string;
  description: string;
  platform: "MT4" | "MT5";
  category: "indicator" | "ea-full" | "ea-pro-source";
  price: number;
  originalPrice: number;
  version: string;
  size: string;
  icon: string;
  downloadUrl: string;
  downloadInstructions: string;
  features: string[];
  includes: string[];
  status: "active" | "inactive" | "coming-soon";
  featured: boolean;
  thumbnail: string;
  gallery: string[];
  commissionRates: {
    paidAffiliate: number;
    freeAffiliate: number;
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    description: "",
    platform: "MT4",
    category: "indicator",
    price: 0,
    originalPrice: 0,
    version: "",
    size: "",
    icon: "",
    downloadUrl: "",
    downloadInstructions: "",
    features: [],
    includes: [],
    status: "active",
    featured: false,
    thumbnail: "",
    gallery: [],
    commissionRates: {
      paidAffiliate: 0.35,
      freeAffiliate: 0.30,
    },
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/products/${productId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Không tìm thấy sản phẩm");
      }

      const data = await response.json();
      const product = data.product;

      if (!product) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }

      setFormData({
        id: product.id || "",
        name: product.name || "",
        description: product.description || "",
        platform: product.platform || "MT4",
        category: product.category || "indicator",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        version: product.version || "",
        size: product.size || "",
        icon: product.icon || "",
        downloadUrl: product.downloadUrl || "",
        downloadInstructions: product.downloadInstructions || "",
        features: Array.isArray(product.features) ? product.features : [],
        includes: Array.isArray(product.includes) ? product.includes : [],
        status: product.status || "active",
        featured: product.featured || false,
        thumbnail: product.thumbnail || "",
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        commissionRates: product.commissionRates || {
          paidAffiliate: 0.35,
          freeAffiliate: 0.30,
        },
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tải sản phẩm";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (type: "features" | "includes" | "gallery") => {
    const input = type === "features" ? featureInput : type === "includes" ? includeInput : galleryInput;
    if (!input.trim()) return;

    const newList = [...formData[type], input.trim()];
    setFormData({ ...formData, [type]: newList });

    if (type === "features") setFeatureInput("");
    else if (type === "includes") setIncludeInput("");
    else setGalleryInput("");
  };

  const handleRemoveItem = (type: "features" | "includes" | "gallery", index: number) => {
    const newList = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.id) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message || "Không thể cập nhật sản phẩm"}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-2">Có lỗi xảy ra</h2>
            <p>{error}</p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin sản phẩm</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/pricing`}
                target="_blank"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye size={18} className="inline mr-2" />
                Xem trang pricing
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader size={18} className="inline mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} className="inline mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product ID * <span className="text-xs text-gray-500">(URL-friendly, không được thay đổi)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: EA ThebenchmarkTrader Full Version"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả ngắn về sản phẩm..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nền tảng *
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as "MT4" | "MT5" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="MT4">MT4</option>
                      <option value="MT5">MT5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="indicator">📊 Indicators</option>
                      <option value="ea-full">🤖 EA Full Version</option>
                      <option value="ea-pro-source">💎 EA Pro + Source Code</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <DollarSign className="inline mr-2" />
                Giá bán
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá hiện tại * (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="1990000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(formData.price)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc (VND) <span className="text-xs text-gray-500">(Để hiển thị giảm giá)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="2990000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Download & Files */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Upload className="inline mr-2" />
                Thông tin file & tải xuống
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phiên bản
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="v2.0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kích thước
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="680 KB"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Download URL *
                  </label>
                  <input
                    type="text"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    placeholder="/files/ThebenchmarkTrader-Full-MT4.ex4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hướng dẫn cài đặt
                  </label>
                  <textarea
                    value={formData.downloadInstructions}
                    onChange={(e) => setFormData({ ...formData, downloadInstructions: e.target.value })}
                    placeholder="Copy file .ex4 vào MT4/MQL4/Experts..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Features & Includes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Info className="inline mr-2" />
                Tính năng & Nội dung
              </h2>
              
              <div className="space-y-6">
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tính năng nổi bật
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("features"))}
                      placeholder="Nhập tính năng..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem("features")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("features", index)}
                          className="hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Includes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bao gồm
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={includeInput}
                      onChange={(e) => setIncludeInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("includes"))}
                      placeholder="Nhập nội dung..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem("includes")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.includes.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("includes", index)}
                          className="hover:text-green-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Upload className="inline mr-2" />
                Hình ảnh
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Ảnh đại diện)
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="/images/product-thumbnail.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.thumbnail && (
                    <div className="mt-4 relative h-40 rounded-lg overflow-hidden">
                      <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery (Nhiều ảnh)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem("gallery"))}
                      placeholder="URL ảnh..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem("gallery")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("gallery", index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trạng thái</h3>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">🟢 Hoạt động</option>
                <option value="inactive">⚫ Ngừng bán</option>
                <option value="coming-soon">🔵 Sắp ra mắt</option>
              </select>
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Tùy chọn</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
                </div>
              </label>
            </div>

            {/* Commission Rates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                <Settings className="inline mr-2" />
                Chiết khấu affiliate
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paid Affiliate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.commissionRates.paidAffiliate}
                    onChange={(e) => setFormData({
                      ...formData,
                      commissionRates: { ...formData.commissionRates, paidAffiliate: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {Math.round(formData.commissionRates.paidAffiliate * 100)}% cho affiliate paid
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Affiliate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.commissionRates.freeAffiliate}
                    onChange={(e) => setFormData({
                      ...formData,
                      commissionRates: { ...formData.commissionRates, freeAffiliate: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {Math.round(formData.commissionRates.freeAffiliate * 100)}% cho affiliate free
                  </p>
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Icon</h3>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🤖"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-2xl text-center"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

