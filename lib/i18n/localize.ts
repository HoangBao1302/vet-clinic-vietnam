export type Locale = "vi" | "en";

const VIETNAMESE_RE =
  /[àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

export function looksVietnamese(text?: string | null): boolean {
  return !!text && VIETNAMESE_RE.test(text);
}

function clean(text?: string | null): string {
  return (text || "").trim();
}

/**
 * Pick a field for the active locale. Never fall back to the other language.
 */
export function pickLocalized(
  locale: Locale,
  vietnamese?: string | null,
  english?: string | null
): { text: string; missing: boolean } {
  const viText = clean(vietnamese);
  const enText = clean(english);

  if (locale === "en") {
    if (enText && !looksVietnamese(enText)) {
      return { text: enText, missing: false };
    }
    return { text: "", missing: true };
  }

  if (viText) {
    return { text: viText, missing: false };
  }
  return { text: "", missing: true };
}

export function pickLocalizedBlog(
  locale: Locale,
  post: {
    title?: string;
    title_en?: string;
    excerpt?: string;
    excerpt_en?: string;
    content?: string;
    content_en?: string;
  }
) {
  const title = pickLocalized(locale, post.title, post.title_en);
  const excerpt = pickLocalized(locale, post.excerpt, post.excerpt_en);
  const content = pickLocalized(locale, post.content, post.content_en);
  return {
    title: title.text,
    excerpt: excerpt.text,
    content: content.text,
    missingTranslation: title.missing || excerpt.missing || content.missing,
  };
}