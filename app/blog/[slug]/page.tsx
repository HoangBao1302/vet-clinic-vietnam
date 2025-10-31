"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2, Crown, Loader } from "lucide-react";
import PremiumBlogGate from "@/components/PremiumBlogGate";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  featured: boolean;
  isPremium: boolean;
  status: string;
  views: number;
  readTime: string;
  publishedAt?: string;
  createdAt: string;
}

const categoryNames: Record<string, string> = {
  news: "📰 Tin Tức",
  education: "🎓 Đào Tạo & Phân Tích",
  "ea-leopard": "🤖 EA ThebenchmarkTrader",
};

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/blog/posts/${slug}`);
      
      if (!response.ok) {
        throw new Error("Bài viết không tồn tại");
      }
      
      const data = await response.json();
      setPost(data.post);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bài viết không tồn tại
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {error || "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
            </p>
            <Link href="/blog" className="btn-primary">
              Quay lại Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = categoryNames[post.category] || post.category;
  const postDate = post.publishedAt || post.createdAt;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Article Header */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/blog"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
              >
                <ArrowLeft size={16} />
                <span>Quay lại Blog</span>
              </Link>

              <div className="mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryName}
                </span>
                {post.isPremium && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown size={14} />
                    Premium
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-6 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{new Date(postDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                  <span>bởi {post.author.name}</span>
                </div>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                  <Share2 size={16} />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-0">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <PremiumBlogGate 
                    isPremium={post.isPremium || false}
                    previewContent={post.excerpt}
                  >
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p><p>Nội dung đang được cập nhật...</p>` }}
                      style={{
                        lineHeight: '1.8',
                      }}
                    />
                  </PremiumBlogGate>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Quan tâm đến EA ThebenchmarkTrader?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Tải demo miễn phí hoặc tìm hiểu thêm về các gói EA của chúng tôi.
                      </p>
                      <div className="flex space-x-4">
                        <Link href="/pricing#demo" className="btn-primary">
                          Tải Demo
                        </Link>
                        <Link href="/pricing" className="btn-secondary">
                          Xem Bảng Giá
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Stats */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Thống kê
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lượt xem:</span>
                          <span className="font-medium">{post.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian đọc:</span>
                          <span className="font-medium">{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-blue-600 text-white p-6 rounded-lg">
                      <h3 className="font-semibold mb-3">
                        Cần hỗ trợ?
                      </h3>
                      <p className="text-blue-100 text-sm mb-4">
                        Liên hệ với team hỗ trợ để được tư vấn chi tiết về EA.
                      </p>
                      <Link href="/pricing#contact" className="btn-secondary w-full text-center block">
                        Liên hệ ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}
