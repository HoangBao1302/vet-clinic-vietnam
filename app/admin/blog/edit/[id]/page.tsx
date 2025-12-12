"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BilingualInput from "@/components/admin/BilingualInput";
import BilingualRichTextEditor from "@/components/admin/BilingualRichTextEditor";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Star,
  Lock,
  Calendar,
  Tag,
  User,
  FileText,
  Loader,
} from "lucide-react";
import ImagePicker from "@/components/ImagePicker";

interface FormData {
  title: string;
  title_en: string;
  slug: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  isPremium: boolean;
  status: "draft" | "published" | "archived";
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    title_en: "",
    slug: "",
    excerpt: "",
    excerpt_en: "",
    content: "",
    content_en: "",
    category: "news",
    tags: [],
    image: "/vet-images/1.png",
    featured: false,
    isPremium: false,
    status: "draft",
  });

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/blog/posts/${postId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Không tìm thấy bài viết");
      }
      
      const data = await response.json();
      const post = data.post;
      
      if (!post) {
        throw new Error("Dữ liệu bài viết không hợp lệ");
      }
      
      setFormData({
        title: post.title || "",
        title_en: post.title_en || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        excerpt_en: post.excerpt_en || "",
        content: post.content || "",
        content_en: post.content_en || "",
        category: post.category || "news",
        tags: Array.isArray(post.tags) ? post.tags : [],
        image: post.image || "/vet-images/1.png",
        featured: post.featured || false,
        isPremium: post.isPremium || false,
        status: post.status || "draft",
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tải bài viết";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData({ ...formData, title, slug });
  };

  const handleTitleEnChange = (title_en: string) => {
    setFormData({ ...formData, title_en });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Cập nhật bài viết thành công!");
        router.push("/admin/blog");
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message || "Không thể cập nhật bài viết"}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Có lỗi xảy ra khi cập nhật bài viết");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài viết...</p>
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
            href="/admin/blog"
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
                href="/admin/blog"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
                <p className="mt-1 text-sm text-gray-500">Cập nhật nội dung bài viết</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/blog/${formData.slug}`}
                target="_blank"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye size={18} className="inline mr-2" />
                Xem trước
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
            {/* Title - Bilingual */}
            <div className="bg-white rounded-lg shadow p-6">
              <BilingualInput
                label={
                  <span className="flex items-center gap-2">
                    <FileText size={16} />
                    Tiêu đề bài viết
                  </span>
                }
                valueVi={formData.title}
                valueEn={formData.title_en}
                onChangeVi={handleTitleChange}
                onChangeEn={handleTitleEnChange}
                type="text"
                placeholderVi="Nhập tiêu đề bài viết..."
                placeholderEn="Enter article title..."
                required
                showAutoTranslate
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="slug-url-friendly"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL: /blog/{formData.slug || "slug-url-friendly"}
                </p>
              </div>
            </div>

            {/* Excerpt - Bilingual */}
            <div className="bg-white rounded-lg shadow p-6">
              <BilingualInput
                label="Mô tả ngắn (Excerpt)"
                valueVi={formData.excerpt}
                valueEn={formData.excerpt_en}
                onChangeVi={(value) => setFormData({ ...formData, excerpt: value })}
                onChangeEn={(value) => setFormData({ ...formData, excerpt_en: value })}
                type="textarea"
                rows={3}
                placeholderVi="Mô tả ngắn gọn về bài viết (150-200 ký tự)..."
                placeholderEn="Short description about the article (150-200 characters)..."
                required
                showAutoTranslate
              />
              <p className="mt-2 text-xs text-gray-500">
                Vietnamese: {formData.excerpt.length}/500 ký tự | English: {formData.excerpt_en.length}/500 characters
              </p>
            </div>

            {/* Content Editor - Bilingual */}
            <div className="bg-white rounded-lg shadow p-6">
              <BilingualRichTextEditor
                label="Nội dung bài viết"
                valueVi={formData.content}
                valueEn={formData.content_en}
                onChangeVi={(content) => setFormData({ ...formData, content })}
                onChangeEn={(content) => setFormData({ ...formData, content_en })}
                placeholderVi="Viết nội dung bài viết của bạn..."
                placeholderEn="Write your article content..."
                required
                showAutoTranslate
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="news">📰 Tin Tức</option>
                <option value="education">🎓 Đào Tạo & Phân Tích</option>
                <option value="ea-leopard">🤖 EA ThebenchmarkTrader</option>
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <ImagePicker
                value={formData.image}
                onChange={(image) => setFormData({ ...formData, image })}
                label="Hình ảnh đại diện"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="inline mr-2" />
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Nhập tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Bài viết nổi bật</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Nội dung Premium</span>
                </div>
              </label>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

