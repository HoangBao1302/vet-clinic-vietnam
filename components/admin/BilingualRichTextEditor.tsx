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

      console.log('Starting translation...');
      console.log('Original text length:', plainText.length);

      // Split content into chunks if too long (max 3000 chars per chunk for better reliability)
      const maxChunkSize = 3000;
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

      console.log(`Split into ${chunks.length} chunk(s)`);

      // Translate each chunk
      const translatedChunks: string[] = [];
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < chunks.length; i++) {
        try {
          console.log(`Translating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);
          
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

          console.log(`Chunk ${i + 1} response status:`, response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            console.error(`Chunk ${i + 1} error:`, errorData);
            throw new Error(`Translation failed: ${errorData.error || response.statusText}`);
          }

          const result = await response.json();
          console.log(`Chunk ${i + 1} result:`, result);
          
          // Check for error in response first
          if (result.error) {
            throw new Error(`API error: ${result.error}`);
          }
          
          // Check if result has translatedText
          if (!result) {
            throw new Error('Empty response from API');
          }
          
          // Handle different response formats
          let translatedText: string | null = null;
          
          if (result.translatedText) {
            translatedText = result.translatedText;
          } else if (typeof result === 'string') {
            translatedText = result;
          } else if (result.text) {
            translatedText = result.text;
          } else {
            const preview = JSON.stringify(result).substring(0, 200);
            throw new Error(`Invalid response format. Response: ${preview}`);
          }
          
          if (!translatedText || translatedText.trim() === '') {
            throw new Error('Translation result is empty');
          }
          
          translatedChunks.push(translatedText);
          successCount++;
          console.log(`✅ Chunk ${i + 1} translated successfully`);
          
          // Small delay between chunks to avoid rate limiting
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (chunkError) {
          failCount++;
          console.error(`❌ Error translating chunk ${i + 1}:`, chunkError);
          
          // If it's the only chunk or first chunk, throw error
          if (chunks.length === 1 || i === 0) {
            throw chunkError;
          }
          
          // For other chunks, add placeholder
          const errorMsg = chunkError instanceof Error ? chunkError.message : 'Unknown error';
          translatedChunks.push(`[❌ Chunk ${i + 1} translation failed: ${errorMsg}. Please translate this section manually.]`);
        }
      }

      // Join translated chunks
      const translatedText = translatedChunks.join('\n\n');
      
      console.log('Translation complete:', { successCount, failCount, totalLength: translatedText.length });
      
      if (!translatedText || translatedText.trim() === '') {
        throw new Error('All translations failed. Please try again or translate manually.');
      }
      
      // Update English content
      onChangeEn(translatedText);
      setActiveTab('en'); // Switch to English tab to show result
      
      if (failCount > 0) {
        alert(`⚠️ Dịch hoàn tất với một số lỗi:
        
✅ Thành công: ${successCount}/${chunks.length} đoạn
❌ Thất bại: ${failCount}/${chunks.length} đoạn

Vui lòng:
1. Check các đoạn có dấu [❌] trong tab English
2. Dịch thủ công các đoạn đó
3. Format lại (bold, lists, headings)`);
      } else {
        alert(`✅ Dịch thành công ${chunks.length > 1 ? `${chunks.length} đoạn` : ''}! 

⚠️ LƯU Ý: 
- Bản dịch là plain text (không có format)
- Vui lòng format lại (bold, lists, headings) trong tab English
- Review và chỉnh sửa nếu cần`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Dịch tự động thất bại: ${errorMessage}

💡 GỢI Ý:
1. Thử với content ngắn hơn (< 3000 ký tự)
2. Hoặc copy text sang Google Translate thủ công: https://translate.google.com
3. Sau đó paste vào tab English và format lại

📋 DEBUG INFO (gửi cho admin nếu cần):
- Error: ${errorMessage}
- Content length: ${valueVi.length} chars
- Check Browser Console (F12) để xem chi tiết`);
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
