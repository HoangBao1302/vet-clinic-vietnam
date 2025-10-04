"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { blogPosts, categories } from "@/data/blogPosts";

export default function BlogPostPage() {
  const params = useParams();
  const [slug, setSlug] = useState<string>("");
  
  useEffect(() => {
    if (params.slug) {
      setSlug(params.slug as string);
    }
  }, [params]);
  
  const post = blogPosts.find(p => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bài viết không tồn tại
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
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

              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === post.category)?.name || post.category}
                </span>
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
                    <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                  <span>bởi {post.author}</span>
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
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p><p>Nội dung đang được cập nhật...</p>` }}
                    style={{
                      lineHeight: '1.8',
                    }}
                  />

                  {/* Article Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Quan tâm đến EA LeopardSmart?
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
                    {/* Table of Contents */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Nội dung bài viết
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="#profit-factor" className="text-blue-600 hover:text-blue-700">
                            Profit Factor là gì?
                          </a>
                        </li>
                        <li>
                          <a href="#drawdown" className="text-blue-600 hover:text-blue-700">
                            Maximum Drawdown
                          </a>
                        </li>
                        <li>
                          <a href="#win-rate" className="text-blue-600 hover:text-blue-700">
                            Win Rate và Risk:Reward
                          </a>
                        </li>
                        <li>
                          <a href="#luu-y" className="text-blue-600 hover:text-blue-700">
                            Lưu ý quan trọng
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Related Articles */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Bài viết liên quan
                      </h3>
                      <div className="space-y-4">
                        <Link href="/blog/chon-broker-phu-hop-ea" className="block">
                          <div className="text-sm">
                            <h4 className="font-medium text-gray-800 hover:text-blue-600 mb-1">
                              Cách chọn broker phù hợp cho EA
                            </h4>
                            <p className="text-gray-600 text-xs">6 phút đọc</p>
                          </div>
                        </Link>
                        
                        <Link href="/blog/quan-tri-rui-ro-ea" className="block">
                          <div className="text-sm">
                            <h4 className="font-medium text-gray-800 hover:text-blue-600 mb-1">
                              Quản trị rủi ro khi sử dụng EA
                            </h4>
                            <p className="text-gray-600 text-xs">10 phút đọc</p>
                          </div>
                        </Link>
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

