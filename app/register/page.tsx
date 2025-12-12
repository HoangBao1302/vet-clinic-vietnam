"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import ReCaptcha, { ReCaptchaRef } from "@/components/ReCaptcha";
import HoneypotField from "@/components/HoneypotField";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLocale();
  const recaptchaRef = useRef<ReCaptchaRef>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [honeypot, setHoneypot] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaTokenRef = useRef<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError(t('auth.register.validation.usernameMin'));
      return false;
    }
    
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError(t('auth.register.validation.emailInvalid'));
      return false;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError(t('auth.register.validation.passwordMin'));
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.validation.passwordMismatch'));
      return false;
    }
    
    return true;
  };

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
    recaptchaTokenRef.current = token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    // Execute reCAPTCHA if needed (only if site key is configured)
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      // If token not ready, execute now and wait for callback
      if (!recaptchaTokenRef.current && recaptchaRef.current) {
        try {
          // Execute reCAPTCHA
          await recaptchaRef.current.execute();
          
          // Wait for token to be set via callback (check ref, not state)
          let attempts = 0;
          while (!recaptchaTokenRef.current && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          // Check if token was received
          if (!recaptchaTokenRef.current) {
            setLoading(false);
            setError('Vui lòng chờ xác thực bảo mật hoàn tất. Nếu vẫn gặp lỗi, vui lòng làm mới trang.');
            return;
          }
        } catch (error) {
          console.error('reCAPTCHA execution error:', error);
          setLoading(false);
          setError('Lỗi xác thực bảo mật. Vui lòng làm mới trang và thử lại.');
          return;
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, require reCAPTCHA
      setLoading(false);
      setError('reCAPTCHA chưa được cấu hình. Vui lòng liên hệ admin.');
      return;
    }
    // In development, allow without reCAPTCHA if not configured

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          recaptchaToken: recaptchaTokenRef.current || recaptchaToken,
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('auth.register.registerFailed'));
      }

      // DO NOT login if requires verification - user must verify email first
      if (data.requiresVerification) {
        setSuccess(t('auth.register.registerSuccess'));
        // Clear form after successful registration
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setHoneypot("");
        setRecaptchaToken(null);
        // DO NOT login - redirect to login page after 5 seconds
        setTimeout(() => {
          router.push("/login?message=verify-email-required");
        }, 5000);
      } else {
        // Only login if verification not required (should not happen in normal flow)
        if (data.token) {
          login(data.token, data.user);
        }
        setSuccess(t('auth.register.registerSuccess'));
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {t('auth.register.title')}
              </h1>
              <p className="text-gray-600">
                {t('auth.register.subtitle')}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-semibold text-gray-800 mb-2">🎁 Quyền lợi khi đăng ký:</div>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>✅ Download EA Demo miễn phí</li>
                <li>✅ 3 indicators miễn phí</li>
                <li>✅ Đọc 3 bài premium/tháng</li>
                <li>✅ Đăng ký làm affiliate (hoa hồng 30%)</li>
                <li>✅ Nhận trading tips hàng tuần</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">{success}</div>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.username')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.register.usernamePlaceholder')}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('auth.register.validation.usernameMin')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.register.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.register.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('auth.register.validation.passwordMin')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.register.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  {t('auth.register.termsPrefix')}{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    {t('auth.register.terms')}
                  </Link>
                  {" "}{t('auth.register.and')}{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    {t('auth.register.privacy')}
                  </Link>
                </label>
              </div>

              {/* Honeypot Field - Hidden from users, visible to bots */}
              <HoneypotField 
                value={honeypot}
                onChange={setHoneypot}
                name="website"
              />

              {/* Google reCAPTCHA v3 - Invisible */}
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                <ReCaptcha
                  ref={recaptchaRef}
                  siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onVerify={handleRecaptchaVerify}
                  onError={(error) => {
                    console.error('reCAPTCHA error:', error);
                    setError('Lỗi xác thực bảo mật. Vui lòng làm mới trang và thử lại.');
                  }}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.register.registering') : t('auth.register.registerButton')}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('auth.register.haveAccount')}{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {t('auth.register.loginNow')}
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Bằng cách đăng ký, bạn sẽ nhận được email welcome với</p>
            <p>hướng dẫn chi tiết và EA Demo miễn phí</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

