/**
 * Normalize Arabic for search: strip tashkeel / Quranic marks so
 * Uthmani (ٱلرَّحْمَـٰنُ) matches undiacritized queries (الرحمن).
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return (
    text
      // tatweel
      .replace(/\u0640/g, "")
      // harakat, Quranic annotation signs, superscript alef (dagger alif)
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      // alef variants → ا
      .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
      // alef maqsura → yeh
      .replace(/\u0649/g, "\u064A")
      .trim()
  );
}

/** Normalize only Arabic runs; leave Latin / punctuation for EN/MS queries. */
export function normalizeSearchQuery(text: string): string {
  if (!text) return "";
  return text
    .split(/(\s+)/)
    .map((part) => (/[\u0600-\u06FF]/.test(part) ? normalizeArabic(part) : part))
    .join("")
    .trim();
}
