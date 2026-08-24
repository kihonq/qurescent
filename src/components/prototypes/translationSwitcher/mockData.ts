// PROTOTYPE — throwaway fixture data, not the real translation pipeline (see wayfinder ticket #5
// for the actual data-source decision: Tanzil + QUL, checked into the repo at build time).
// Just enough mock text to judge the UI shape for ticket #8.

export interface MockTranslation {
  code: string;
  language: string;
  editionName: string;
  text: string;
}

const SAMPLE_TEXTS: Record<string, string> = {
  en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  ms: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.",
  ur: "اللہ کے نام سے جو رحمان و رحیم ہے۔",
  id: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
  tr: "Rahmân ve Rahîm olan Allah'ın adıyla.",
};

const ALL_TRANSLATIONS: MockTranslation[] = [
  { code: "en", language: "English", editionName: "Saheeh International", text: SAMPLE_TEXTS.en },
  { code: "ms", language: "Bahasa Melayu", editionName: "Abdullah Basmeih", text: SAMPLE_TEXTS.ms },
  { code: "ur", language: "اردو", editionName: "Fateh Muhammad Jalandhari", text: SAMPLE_TEXTS.ur },
  { code: "id", language: "Bahasa Indonesia", editionName: "Kemenag", text: SAMPLE_TEXTS.id },
  { code: "tr", language: "Türkçe", editionName: "Diyanet İşleri", text: SAMPLE_TEXTS.tr },
];

export const DEFAULT_ENABLED_CODES = ["en", "ms"];

export const getAllMockTranslations = (): MockTranslation[] => ALL_TRANSLATIONS;
