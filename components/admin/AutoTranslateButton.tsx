"use client";

import { useState } from 'react';
import { Languages, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AutoTranslateButtonProps {
  /** Text to translate */
  text: string;
  /** Type of content: text, blog, partner */
  type?: 'text' | 'blog' | 'partner';
  /** Additional data for blog/partner translation */
  data?: any;
  /** Callback when translation completes */
  onTranslated: (translatedText: string | any) => void;
  /** Source language */
  sourceLang?: 'vi' | 'en' | 'auto';
  /** Target language */
  targetLang?: 'vi' | 'en';
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export default function AutoTranslateButton({
  text,
  type = 'text',
  data,
  onTranslated,
  sourceLang = 'vi',
  targetLang = 'en',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: AutoTranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!text && type === 'text') {
      setError('Vui lòng nhập nội dung cần dịch');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = type === 'text' 
        ? { type, data: { text }, sourceLang, targetLang }
        : { type, data, sourceLang, targetLang };

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Dịch tự động thất bại');
      }

      const result = await response.json();
      
      // Extract translated text based on type
      const translatedResult = type === 'text' 
        ? result.translatedText 
        : result;

      onTranslated(translatedResult);
      setSuccess(true);

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || 'Có lỗi xảy ra khi dịch');
    } finally {
      setIsTranslating(false);
    }
  };

  // Button style variants
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  // Button size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonClasses = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    rounded-lg font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center gap-2
    ${className}
  `;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleTranslate}
        disabled={disabled || isTranslating || (!text && type === 'text')}
        className={buttonClasses}
        title={sourceLang === 'vi' ? 'Dịch sang tiếng Anh' : 'Translate to Vietnamese'}
      >
        {isTranslating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Đang dịch...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={16} />
            <span>Đã dịch!</span>
          </>
        ) : (
          <>
            <Languages size={16} />
            <span>
              {sourceLang === 'vi' ? 'Dịch sang Tiếng Anh' : 'Translate to English'}
            </span>
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success message */}
      {success && !error && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>Dịch tự động thành công! Bạn có thể chỉnh sửa nếu cần.</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline variant
 */
export function AutoTranslateIconButton({
  text,
  onTranslated,
  sourceLang = 'vi',
  targetLang = 'en',
  disabled = false,
}: Pick<AutoTranslateButtonProps, 'text' | 'onTranslated' | 'sourceLang' | 'targetLang' | 'disabled'>) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;

    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          data: { text },
          sourceLang,
          targetLang,
        }),
      });

      const result = await response.json();
      onTranslated(result.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={disabled || isTranslating || !text}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Auto-translate"
    >
      {isTranslating ? (
        <Loader2 size={18} className="animate-spin text-blue-600" />
      ) : (
        <Languages size={18} className="text-gray-600 hover:text-blue-600" />
      )}
    </button>
  );
}

