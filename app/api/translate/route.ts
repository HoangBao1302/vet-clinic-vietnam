import { NextRequest, NextResponse } from 'next/server';
import { translateText, translateBlogPost, translatePartner } from '@/lib/translation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, sourceLang = 'vi', targetLang = 'en' } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'text':
        // Simple text translation
        result = await translateText(data.text, { sourceLang, targetLang });
        return NextResponse.json({ translatedText: result });

      case 'blog':
        // Translate entire blog post
        result = await translateBlogPost(data);
        return NextResponse.json(result);

      case 'partner':
        // Translate partner info
        result = await translatePartner(data);
        return NextResponse.json(result);

      case 'batch':
        // Batch translate multiple texts
        const texts = data.texts || [];
        const translations = await Promise.all(
          texts.map((text: string) =>
            translateText(text, { sourceLang, targetLang })
          )
        );
        return NextResponse.json({ translations });

      default:
        return NextResponse.json(
          { error: `Unknown translation type: ${type}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}

// Get translation usage statistics
export async function GET() {
  try {
    const { getTranslationUsage } = await import('@/lib/translation');
    const usage = await getTranslationUsage();
    
    return NextResponse.json({
      used: usage.characterCount,
      limit: usage.characterLimit,
      remaining: usage.characterLimit - usage.characterCount,
      percentage: (usage.characterCount / usage.characterLimit) * 100,
    });
  } catch (error: any) {
    console.error('Failed to get translation usage:', error);
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    );
  }
}

