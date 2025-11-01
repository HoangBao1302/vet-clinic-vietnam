"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
import { Check, Download, ShoppingCart, Star, ChevronDown, ChevronUp, Send, Youtube, PlayCircle, Video, AlertCircle } from "lucide-react";
import HoneypotField from "@/components/HoneypotField";

const pricingPlans = [
  {
    id: "demo",
    name: "Demo",
    price: "0đ",
    period: "Miễn phí",
    description: "Dùng thử EA với tài khoản demo",
    features: [
      "Chạy trên tài khoản demo",
      "Đầy đủ tính năng EA",
      "Hỗ trợ MT4/MT5",
      "Báo cáo hiệu suất",
      "Hướng dẫn cài đặt",
      "Hỗ trợ email"
    ],
    limitations: [
      "Chỉ chạy trên demo",
      "Không có source code",
      "Hỗ trợ cơ bản"
    ],
    cta: "Tải Demo",
    popular: false,
    color: "border-gray-200"
  },
  {
    id: "full",
    name: "Full Version",
    price: "7.900.000đ",
    period: "Một lần",
    description: "Phiên bản đầy đủ cho tài khoản thực",
    features: [
      "Chạy trên tài khoản thực",
      "Đầy đủ tính năng EA",
      "Hỗ trợ MT4/MT5",
      "Báo cáo chi tiết",
      "Hướng dẫn cài đặt",
      "Hỗ trợ 1-1 qua Telegram",
      "Cập nhật miễn phí 1 năm",
      "Tùy chỉnh tham số"
    ],
    limitations: [
      "Không có source code",
      "Giới hạn 3 tài khoản"
    ],
    cta: "Mua ngay",
    popular: true,
    color: "border-blue-500"
  },
  {
    id: "pro",
    name: "Pro + Source",
    price: "14.900.000đ",
    period: "Một lần",
    description: "Phiên bản Pro với source code",
    features: [
      "Tất cả tính năng Full",
      "Source code đầy đủ",
      "Không giới hạn tài khoản",
      "Hỗ trợ tùy chỉnh cao cấp",
      "Hỗ trợ VIP 24/7",
      "Cập nhật miễn phí trọn đời",
      "Đào tạo 1-1",
      "Tư vấn chiến lược"
    ],
    limitations: [],
    cta: "Liên hệ",
    popular: false,
    color: "border-purple-500"
  }
];

const faqs = [
  {
    question: "Chính sách license như thế nào?",
    answer: "Gói Demo: Chỉ chạy demo, không giới hạn thời gian. Gói Full: Chạy tối đa 3 tài khoản thực, license trọn đời. Gói Pro: Không giới hạn tài khoản, có source code."
  },
  {
    question: "EA có được cập nhật không?",
    answer: "Gói Full: Cập nhật miễn phí trong 1 năm. Gói Pro: Cập nhật miễn phí trọn đời. Tất cả các cập nhật đều bao gồm tối ưu hóa và tính năng mới."
  },
  {
    question: "Có chính sách hoàn tiền không?",
    answer: "Chúng tôi có chính sách hoàn tiền 100% trong 30 ngày nếu EA không hoạt động đúng như mô tả. Tuy nhiên, chúng tôi khuyến khích dùng thử Demo trước khi mua."
  },
  {
    question: "Hỗ trợ kỹ thuật như thế nào?",
    answer: "Gói Demo: Hỗ trợ email. Gói Full: Hỗ trợ 1-1 qua Telegram + email. Gói Pro: Hỗ trợ VIP 24/7 qua Telegram, phone và TeamViewer."
  },
  {
    question: "EA hoạt động trên broker nào?",
    answer: "EA hoạt động trên hầu hết các broker hỗ trợ MT4/MT5. Chúng tôi khuyến nghị các broker có spread thấp và execution nhanh như IC Markets, Pepperstone, FXCM."
  },
  {
    question: "Tôi có thể tùy chỉnh EA không?",
    answer: "Gói Full: Hỗ trợ tùy chỉnh tham số cơ bản. Gói Pro: Có source code, bạn có thể tùy chỉnh hoàn toàn hoặc nhờ chúng tôi hỗ trợ tùy chỉnh cao cấp."
  }
];

// Client-side email validation
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "demo",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate email in real-time
    if (name === 'email') {
      if (value && !isValidEmail(value.trim())) {
        setEmailError('Email không đúng định dạng');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePlanClick = (planId: string) => {
    // Reset submit message khi click button mới
    setSubmitMessage("");
    
    // Mapping plan ID to form topic
    const topicMap: { [key: string]: string } = {
      'demo': 'demo',
      'full': 'purchase', 
      'pro': 'custom'
    };
    
    const topic = topicMap[planId];
    if (topic) {
      // Set form data trước
      setFormData(prev => ({ 
        ...prev, 
        topic,
        message: planId === 'demo' 
          ? "Tôi muốn tải demo EA ThebenchmarkTrader để dùng thử trên tài khoản demo." 
          : planId === 'full'
          ? "Tôi quan tâm đến gói Full Version EA ThebenchmarkTrader."
          : "Tôi quan tâm đến gói Pro + Source Code EA ThebenchmarkTrader."
      }));
      
      // Scroll xuống form sau một chút để user thấy được update
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot');
      return; // Silent fail
    }
    
    // Email validation
    const trimmedEmail = formData.email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Email không đúng định dạng. Vui lòng nhập email hợp lệ.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage("");
    setEmailError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          honeypot: honeypot,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitMessage("Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.");
        setFormData({ name: "", email: "", topic: "demo", message: "" });
        setHoneypot("");
      } else {
        const errorMsg = result.error || "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.";
        setSubmitMessage(errorMsg);
        // If email validation error, highlight email field
        if (errorMsg.toLowerCase().includes('email')) {
          setEmailError(errorMsg);
        }
      }
    } catch {
      setSubmitMessage("Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.");
    } finally {
      setIsSubmitting(false);
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
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Từ bản demo miễn phí đến phiên bản Pro với source code, 
              chúng tôi có giải pháp cho mọi nhu cầu giao dịch
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  id={plan.id}
                  className={`relative bg-white border-2 ${plan.color} rounded-2xl p-8 shadow-lg ${
                    plan.popular ? 'transform scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star size={16} className="fill-current" />
                        <span>Phổ biến nhất</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-800 mb-2">{plan.price}</div>
                    <div className="text-gray-600 mb-4">{plan.period}</div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-gray-800">Tính năng:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-800 mt-6">Giới hạn:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-4 h-4 mt-1 flex-shrink-0 border border-gray-300 rounded-full"></div>
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {isClient ? (
                    <button 
                      onClick={() => handlePlanClick(plan.id)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {plan.id === 'demo' && <Download size={18} className="inline mr-2" />}
                      {plan.id === 'full' && <ShoppingCart size={18} className="inline mr-2" />}
                      {plan.id === 'pro' && <Send size={18} className="inline mr-2" />}
                      {plan.cta}
                    </button>
                  ) : (
                    <div 
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {plan.id === 'demo' && <Download size={18} className="inline mr-2" />}
                      {plan.id === 'full' && <ShoppingCart size={18} className="inline mr-2" />}
                      {plan.id === 'pro' && <Send size={18} className="inline mr-2" />}
                      {plan.cta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Video Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <Video className="text-red-600" size={48} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Hướng Dẫn Cài Đặt EA
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Xem video hướng dẫn chi tiết từng bước cài đặt EA ThebenchmarkTrader trên MT4/MT5, 
                  cấu hình tham số và bắt đầu giao dịch
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">01</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Cài Đặt EA</h3>
                  <p className="text-sm text-gray-600">
                    Hướng dẫn import và kích hoạt EA trên nền tảng MT4/MT5
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">02</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Cấu Hình</h3>
                  <p className="text-sm text-gray-600">
                    Thiết lập tham số phù hợp với mức vốn và chiến lược của bạn
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">03</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bắt Đầu</h3>
                  <p className="text-sm text-gray-600">
                    Kích hoạt EA và theo dõi hiệu suất giao dịch
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    try {
                      // Primary URL - use the specific video link from remote
                      const url = 'https://www.youtube.com/watch?v=Ld_k8T_UQPc&list=PLeTOW6sILCDjZAV7VKoILaxKe6-OOnjNp';
                      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                      
                      // Fallback if popup blocked
                      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = url;
                      }
                    } catch (error) {
                      console.error('Error opening YouTube:', error);
                      // Fallback to direct navigation
                      window.location.href = 'https://www.youtube.com/watch?v=Ld_k8T_UQPc&list=PLeTOW6sILCDjZAV7VKoILaxKe6-OOnjNp';
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Youtube size={24} />
                  <span>Xem Video Hướng Dẫn Cài Đặt</span>
                </button>
                <button
                  onClick={() => {
                    try {
                      // Primary URL
                      const url = 'https://www.youtube.com/@ThebenchmarkTraderEA/playlists';
                      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                      
                      // Fallback if popup blocked
                      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = url;
                      }
                    } catch (error) {
                      console.error('Error opening YouTube playlists:', error);
                      // Fallback to direct navigation
                      window.location.href = 'https://www.youtube.com/@ThebenchmarkTraderEA/playlists';
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <PlayCircle size={24} />
                  <span>Xem Tất Cả Video Tutorial</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  <strong>💡 Tip:</strong> Xem hết video trước khi cài đặt để hiểu rõ quy trình. 
                  Nếu cần hỗ trợ, liên hệ qua Telegram Group: t.me/+0ETUdIuYUzdhZWQ1
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg text-gray-600">
                Giải đáp những thắc mắc phổ biến về EA ThebenchmarkTrader
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20 bg-white">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đăng ký hoặc đặt mua
              </h2>
              <p className="text-lg text-gray-600">
                Điền form dưới đây để nhận demo hoặc đặt mua EA ThebenchmarkTrader
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Gói quan tâm *
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="demo">Demo - Miễn phí</option>
                    <option value="purchase">Full Version - 7.9tr</option>
                    <option value="custom">Pro + Source - 14.9tr</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết nhu cầu của bạn..."
                  />
                </div>

                {/* Honeypot Field - Hidden from users, visible to bots */}
                <HoneypotField 
                  value={honeypot}
                  onChange={setHoneypot}
                  name="website"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}</span>
                </button>
              </form>
              
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-lg text-sm ${
                  submitMessage.includes("Cảm ơn") 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {submitMessage}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallToAction />
    </div>
  );
}

