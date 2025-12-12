"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AutoTranslateButton from './AutoTranslateButton';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Đang tải trình soạn thảo...</p>
    </div>
  ),
});

interface BilingualRichTextEditorProps {
  label: string;
  valueVi: string;
  valueEn: string;
  onChangeVi: (value: string) => void;
  onChangeEn: (value: string) => void;
  placeholderVi?: string;
  placeholderEn?: string;
  required?: boolean;
  showAutoTranslate?: boolean;
}

export default function BilingualRichTextEditor({
  label,
  valueVi,
  valueEn,
  onChangeVi,
  onChangeEn,
  placeholderVi = 'Nhập nội dung...',
  placeholderEn = 'Enter content...',
  required = false,
  showAutoTranslate = true,
}: BilingualRichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'vi' | 'en'>('vi');
  const [translating, setTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!valueVi) {
      alert('Vui lòng nhập nội dung tiếng Việt trước');
      return;
    }

    setTranslating(true);

    try {
      // Strip HTML tags for better translation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = valueVi;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';

      if (!plainText.trim()) {
        alert('Không có nội dung text để dịch');
        setTranslating(false);
        return;
      }

      // Split content into chunks if too long (max 5000 chars per chunk)
      const maxChunkSize = 5000;
      const chunks: string[] = [];
      
      if (plainText.length <= maxChunkSize) {
        chunks.push(plainText);
      } else {
        // Split by paragraphs
        const paragraphs = plainText.split('\n\n');
        let currentChunk = '';
        
        for (const para of paragraphs) {
          if ((currentChunk + para).length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
          } else {
            currentChunk += (currentChunk ? '\n\n' : '') + para;
          }
        }
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
      }

      // Translate each chunk
      const translatedChunks: string[] = [];
      
      for (let i = 0; i < chunks.length; i++) {
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'text',
              data: { text: chunks[i] },
              sourceLang: 'vi',
              targetLang: 'en',
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(`Translation failed for chunk ${i + 1}: ${errorData.error || response.statusText}`);
          }

          const result = await response.json();
          
          // Check if result has translatedText
          if (!result) {
            throw new Error(`Empty response from translation API for chunk ${i + 1}`);
          }
          
          if (!result.translatedText) {
            // Check if result is a string (direct translation)
            if (typeof result === 'string') {
              translatedChunks.push(result);
            } else {
              throw new Error(`Invalid response format from translation API for chunk ${i + 1}. Expected 'translatedText' field.`);
            }
          } else {
            translatedChunks.push(result.translatedText);
          }
          
          // Update progress if multiple chunks
          if (chunks.length > 1) {
            console.log(`Đã dịch ${i + 1}/${chunks.length} đoạn...`);
          }
        } catch (chunkError) {
          console.error(`Error translating chunk ${i + 1}:`, chunkError);
          // If one chunk fails, try to continue with others
          if (chunks.length === 1) {
            throw chunkError; // Re-throw if it's the only chunk
          }
          // For multiple chunks, add error message
          translatedChunks.push(`[Translation error for chunk ${i + 1}: ${chunkError instanceof Error ? chunkError.message : 'Unknown error'}]`);
        }
      }

      // Join translated chunks
      const translatedText = translatedChunks.join('\n\n');
      
      if (!translatedText || translatedText.trim() === '' || translatedText.includes('[Translation error')) {
        throw new Error('Translation failed for all chunks. Please try again or translate manually.');
      }
      
      // Update English content
      onChangeEn(translatedText);
      setActiveTab('en'); // Switch to English tab to show result
      
      alert(`✅ Dịch thành công ${chunks.length > 1 ? `${chunks.length} đoạn` : ''}! 

⚠️ LƯU Ý: 
- Bản dịch là plain text (không có format)
- Vui lòng format lại (bold, lists, headings) trong tab English
- Review và chỉnh sửa nếu cần`);
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Dịch tự động thất bại: ${errorMessage}

💡 GỢI Ý:
- Thử chia nhỏ content thành nhiều phần
- Hoặc copy text sang Google Translate thủ công
- Sau đó paste vào tab English và format lại`);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-3">
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

        {/* Auto-translate button (only show in Vietnamese tab) */}
        {showAutoTranslate && activeTab === 'vi' && valueVi && (
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {translating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang dịch...</span>
              </>
            ) : (
              <>
                🌍 <span>Dịch sang Tiếng Anh</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div className="border-2 border-gray-200 rounded-b-lg rounded-tr-lg bg-white">
        {activeTab === 'vi' ? (
          <RichTextEditor
            value={valueVi}
            onChange={onChangeVi}
            placeholder={placeholderVi}
          />
        ) : (
          <div className="space-y-2">
            <RichTextEditor
              value={valueEn}
              onChange={onChangeEn}
              placeholder={placeholderEn}
            />
            <p className="px-4 pb-4 text-xs text-gray-500">
              ✏️ Có thể chỉnh sửa bản dịch tự động để cải thiện chất lượng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

