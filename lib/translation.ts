/**
 * Auto-Translation Service
 * Using DeepL API for high-quality translations
 * Free tier: 500,000 characters/month
 */

interface TranslationResult {
  text: string;
  detectedSourceLang?: string;
}

interface TranslateOptions {
  sourceLang?: 'vi' | 'en' | 'auto';
  targetLang: 'vi' | 'en';
  preserveFormatting?: boolean;
}

/**
 * Translate text using DeepL API
 * Falls back to Google Translate if DeepL is not available
 */
export async function translateText(
  text: string,
  options: TranslateOptions
): Promise<string> {
  const { sourceLang = 'auto', targetLang, preserveFormatting = true } = options;

  // If text is empty, return empty
  if (!text || text.trim() === '') {
    return '';
  }

  // If source and target are the same, return original
  if (sourceLang === targetLang) {
    return text;
  }

  try {
    // Try DeepL first (best quality)
    const deeplResult = await translateWithDeepL(text, sourceLang, targetLang, preserveFormatting);
    if (deeplResult) {
      return deeplResult;
    }

    // Fallback to Google Translate
    console.warn('DeepL unavailable, falling back to Google Translate');
    const googleResult = await translateWithGoogle(text, sourceLang, targetLang);
    if (googleResult) {
      return googleResult;
    }

    // If both fail, return original text with warning
    console.error('All translation services failed');
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original on error
  }
}

/**
 * Translate using DeepL API
 */
async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string,
  preserveFormatting: boolean
): Promise<string | null> {
  const deeplApiKey = process.env.DEEPL_API_KEY;
  
  if (!deeplApiKey) {
    console.warn('DEEPL_API_KEY not configured');
    return null;
  }

  const isFreeAccount = deeplApiKey.endsWith(':fx');
  const endpoint = isFreeAccount
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const body = new URLSearchParams({
    auth_key: deeplApiKey,
    text: text,
    source_lang: sourceLang.toUpperCase() === 'AUTO' ? '' : sourceLang.toUpperCase(),
    target_lang: targetLang.toUpperCase() === 'EN' ? 'EN-US' : targetLang.toUpperCase(),
    preserve_formatting: preserveFormatting ? '1' : '0',
    tag_handling: 'html', // Preserve HTML tags
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('DeepL request failed:', error);
    return null;
  }
}

/**
 * Translate using Google Translate (Fallback)
 * Using free unofficial API endpoint
 */
async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string | null> {
  try {
    // Use Google Translate unofficial API
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', sourceLang === 'auto' ? 'auto' : sourceLang);
    url.searchParams.set('tl', targetLang);
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', text);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('Google Translate error:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Parse Google Translate response format
    if (data && data[0]) {
      const translatedParts = data[0].map((part: any[]) => part[0]).filter(Boolean);
      return translatedParts.join('');
    }

    return null;
  } catch (error) {
    console.error('Google Translate request failed:', error);
    return null;
  }
}

/**
 * Translate HTML content while preserving structure
 */
export async function translateHTML(
  html: string,
  options: TranslateOptions
): Promise<string> {
  // DeepL handles HTML automatically with tag_handling: 'html'
  return translateText(html, { ...options, preserveFormatting: true });
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  options: TranslateOptions
): Promise<string[]> {
  // Translate sequentially to avoid rate limits
  const results: string[] = [];
  
  for (const text of texts) {
    const translated = await translateText(text, options);
    results.push(translated);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Translate blog post object
 */
export async function translateBlogPost(post: {
  title: string;
  excerpt: string;
  content?: string;
}): Promise<{
  title_en: string;
  excerpt_en: string;
  content_en?: string;
}> {
  const [title_en, excerpt_en, content_en] = await Promise.all([
    translateText(post.title, { sourceLang: 'vi', targetLang: 'en' }),
    translateText(post.excerpt, { sourceLang: 'vi', targetLang: 'en' }),
    post.content
      ? translateHTML(post.content, { sourceLang: 'vi', targetLang: 'en' })
      : Promise.resolve(''),
  ]);

  return {
    title_en,
    excerpt_en,
    content_en: content_en || undefined,
  };
}

/**
 * Translate partner object
 */
export async function translatePartner(partner: {
  name: string;
  description?: string;
}): Promise<{
  name_en: string;
  description_en?: string;
}> {
  const [name_en, description_en] = await Promise.all([
    translateText(partner.name, { sourceLang: 'vi', targetLang: 'en' }),
    partner.description
      ? translateText(partner.description, { sourceLang: 'vi', targetLang: 'en' })
      : Promise.resolve(''),
  ]);

  return {
    name_en,
    description_en: description_en || undefined,
  };
}

/**
 * Get translation usage stats (for monitoring)
 */
export async function getTranslationUsage(): Promise<{
  characterCount: number;
  characterLimit: number;
}> {
  const deeplApiKey = process.env.DEEPL_API_KEY;
  
  if (!deeplApiKey) {
    return { characterCount: 0, characterLimit: 0 };
  }

  const isFreeAccount = deeplApiKey.endsWith(':fx');
  const endpoint = isFreeAccount
    ? 'https://api-free.deepl.com/v2/usage'
    : 'https://api.deepl.com/v2/usage';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ auth_key: deeplApiKey }),
    });

    if (!response.ok) {
      return { characterCount: 0, characterLimit: 0 };
    }

    const data = await response.json();
    return {
      characterCount: data.character_count || 0,
      characterLimit: data.character_limit || 500000,
    };
  } catch (error) {
    console.error('Failed to get translation usage:', error);
    return { characterCount: 0, characterLimit: 0 };
  }
}

