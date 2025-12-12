"use client";

import { useState } from 'react';
import AutoTranslateButton, { AutoTranslateIconButton } from './AutoTranslateButton';

interface BilingualInputProps {
  /** Label for the input */
  label: string;
  /** Vietnamese value */
  valueVi: string;
  /** English value */
  valueEn: string;
  /** Callback when Vietnamese value changes */
  onChangeVi: (value: string) => void;
  /** Callback when English value changes */
  onChangeEn: (value: string) => void;
  /** Input type: text, textarea, or editor */
  type?: 'text' | 'textarea' | 'editor';
  /** Placeholder for Vietnamese input */
  placeholderVi?: string;
  /** Placeholder for English input */
  placeholderEn?: string;
  /** Required field */
  required?: boolean;
  /** Show auto-translate button */
  showAutoTranslate?: boolean;
  /** Number of rows for textarea */
  rows?: number;
  /** Custom class name */
  className?: string;
}

export default function BilingualInput({
  label,
  valueVi,
  valueEn,
  onChangeVi,
  onChangeEn,
  type = 'text',
  placeholderVi = '',
  placeholderEn = '',
  required = false,
  showAutoTranslate = true,
  rows = 4,
  className = '',
}: BilingualInputProps) {
  const [activeTab, setActiveTab] = useState<'vi' | 'en'>('vi');

  const handleAutoTranslate = (translatedText: string) => {
    onChangeEn(translatedText);
    setActiveTab('en'); // Switch to English tab to show result
  };

  const renderInput = (lang: 'vi' | 'en') => {
    const value = lang === 'vi' ? valueVi : valueEn;
    const onChange = lang === 'vi' ? onChangeVi : onChangeEn;
    const placeholder = lang === 'vi' ? placeholderVi : placeholderEn;

    const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
          required={required && lang === 'vi'}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
        required={required && lang === 'vi'}
      />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Language Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vi')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'vi'
                ? 'bg-white text-blue-600 border-t-2 border-x-2 border-blue-600 border-b-0'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'en'
                ? 'bg-white text-blue-600 border-t-2 border-x-2 border-blue-600 border-b-0'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Auto-translate icon button */}
        {showAutoTranslate && activeTab === 'vi' && (
          <AutoTranslateIconButton
            text={valueVi}
            onTranslated={handleAutoTranslate}
            disabled={!valueVi}
          />
        )}
      </div>

      {/* Input Area */}
      <div className="border-2 border-gray-200 rounded-b-lg rounded-tr-lg p-4 bg-white">
        {activeTab === 'vi' ? (
          <div className="space-y-3">
            {renderInput('vi')}
            
            {/* Auto-translate button for Vietnamese tab */}
            {showAutoTranslate && valueVi && (
              <AutoTranslateButton
                text={valueVi}
                onTranslated={handleAutoTranslate}
                variant="outline"
                size="sm"
              />
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {renderInput('en')}
            <p className="text-xs text-gray-500">
              ✏️ Có thể chỉnh sửa bản dịch tự động để cải thiện chất lượng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

