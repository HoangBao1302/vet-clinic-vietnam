"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, TrendingUp, BarChart3, Shield, Newspaper, GraduationCap, Bot } from "lucide-react";
import { blogPosts, categories } from "@/data/blogPosts";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // Filter posts by category
  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Get category stats
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return blogPosts.length;
    return blogPosts.filter(post => post.category === categoryId).length;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterMessage("Vui lòng nhập email của bạn");
      return;
    }

    setNewsletterSubmitting(true);
    setNewsletterMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: newsletterEmail,
          topic: "support",
          message: `Đăng ký nhận bài viết mới từ blog EA ThebenchmarkTrader.\n\nEmail: ${newsletterEmail}`,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setNewsletterMessage("✅ Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
        setNewsletterEmail("");
      } else {
        setNewsletterMessage("❌ " + (result.error || "Đã xảy ra lỗi. Vui lòng thử lại."));
      }
    } catch {
      setNewsletterMessage("❌ Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Blog EA ThebenchmarkTrader
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tin tức thị trường, kiến thức giao dịch và hướng dẫn chuyên sâu về EA
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-12 bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                const count = getCategoryCount(category.id);
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 lg:flex-initial px-6 py-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-lg">{category.name}</div>
                        <div className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                          {count} bài viết
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Category Description */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 max-w-2xl mx-auto">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-20 bg-white">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Bài viết nổi bật
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <Link href={`/blog/${featuredPost.id}`}>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                    <div className="relative h-64 md:h-80">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {categories.find(c => c.id === featuredPost.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(featuredPost.date).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{featuredPost.readTime}</span>
                          </div>
                          <div className="hidden sm:block text-gray-400">•</div>
                          <div className="hidden sm:block">{featuredPost.author}</div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-blue-600 font-medium">
                          <span>Đọc tiếp</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            {regularPosts.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {selectedCategory === "all" ? "Tất cả bài viết" : "Bài viết khác"}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {regularPosts.length} bài viết trong mục này
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {regularPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:translate-y-[-4px]">
                        <div className="relative h-48">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                              {categories.find(c => c.id === post.category)?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="text-xs text-gray-500 mb-4 line-clamp-1">
                            {post.author}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            
                            <ArrowRight size={14} className="text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Chưa có bài viết trong mục này
                </h3>
                <p className="text-gray-600">
                  Hãy quay lại sau để xem các bài viết mới nhất
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Component */}
        <Newsletter variant="hero" />
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}
