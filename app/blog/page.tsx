"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, TrendingUp, Eye, Loader } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface BlogPost {
  _id: string;
  title: string;
  title_en?: string;
  slug: string;
  excerpt: string;
  excerpt_en?: string;
  author: {
    name: string;
  };
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  isPremium: boolean;
  views: number;
  readTime: string;
  publishedAt: string;
  createdAt: string;
}

const categories = [
  {
    id: "all",
    name: "📚 Tất cả",
    description: "Tất cả bài viết về trading, phân tích thị trường và EA",
    icon: "📚",
  },
  {
    id: "news",
    name: "📰 Tin Tức",
    description: "Tin tức thị trường, dữ liệu kinh tế và phân tích mới nhất",
    icon: "📰",
  },
  {
    id: "education",
    name: "🎓 Đào Tạo",
    description: "Kiến thức trading, chiến lược và kỹ thuật phân tích",
    icon: "🎓",
  },
  {
    id: "ea-leopard",
    name: "🤖 EA ThebenchmarkTrader",
    description: "Hướng dẫn, cập nhật và tối ưu EA ThebenchmarkTrader",
    icon: "🤖",
  },
];

export default function BlogPage() {
  const { locale } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  // Helper function to get localized content for a post
  const getLocalizedPost = (post: BlogPost) => {
    if (locale === 'en') {
      return {
        ...post,
        title: post.title_en || post.title,
        excerpt: post.excerpt_en || post.excerpt,
      };
    }
    return post;
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      
      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        
        // Calculate category stats
        const stats: Record<string, number> = { all: data.pagination?.total || 0 };
        data.posts.forEach((post: BlogPost) => {
          stats[post.category] = (stats[post.category] || 0) + 1;
        });
        setCategoryStats(stats);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  const getCategoryCount = (categoryId: string) => {
    return categoryStats[categoryId] || 0;
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
        <section className="py-8 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom text-center">
            <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6">
              Blog EA ThebenchmarkTrader
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto mb-4 md:mb-8">
              Tin tức thị trường, kiến thức giao dịch và hướng dẫn chuyên sâu về EA
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-3 md:py-12 bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-center justify-center">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                const count = getCategoryCount(category.id);
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 lg:flex-initial px-3 md:px-6 py-2 md:py-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <span className="text-lg md:text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-sm md:text-lg">{category.name}</div>
                        <div className={`text-xs md:text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                          {count} bài viết
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Category Description - Hidden on mobile */}
            <div className="mt-3 md:mt-6 text-center hidden md:block">
              <p className="text-gray-600 max-w-2xl mx-auto">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-8 md:py-20 bg-white">
            <div className="container-custom">
              <div className="text-center mb-6 md:mb-12">
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">
                  Bài viết nổi bật
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                    <div className="relative h-64 md:h-80">
                      <Image
                        src={featuredPost.image}
                        alt={getLocalizedPost(featuredPost).title}
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
                        {getLocalizedPost(featuredPost).title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {getLocalizedPost(featuredPost).excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{featuredPost.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={16} />
                            <span>{featuredPost.views.toLocaleString()} lượt xem</span>
                          </div>
                          <div className="hidden sm:block text-gray-400">•</div>
                          <div className="hidden sm:block">{featuredPost.author.name}</div>
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
        <section className="py-8 md:py-20 bg-gray-50">
          <div className="container-custom">
            {loading ? (
              <div className="text-center py-20">
                <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Đang tải bài viết...</p>
              </div>
            ) : regularPosts.length > 0 ? (
              <>
                <div className="text-center mb-6 md:mb-12">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">
                    {selectedCategory === "all" ? "Tất cả bài viết" : "Bài viết khác"}
                  </h2>
                  <p className="text-sm md:text-lg text-gray-600">
                    {regularPosts.length} bài viết trong mục này
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
                  {regularPosts.map((post) => {
                    const localizedPost = getLocalizedPost(post);
                    return (
                      <Link key={post._id} href={`/blog/${post.slug}`}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full hover:translate-y-[-4px]">
                          <div className="relative h-48">
                            <Image
                              src={post.image}
                              alt={localizedPost.title}
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
                              {localizedPost.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                              {localizedPost.excerpt}
                            </p>
                          
                          <div className="text-xs text-gray-500 mb-4 line-clamp-1">
                            {post.author.name}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}</span>
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
                    );
                  })}
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
