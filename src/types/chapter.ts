export interface IChapterVerseWord {
  id: number;
  position: number;
  audio_url: string;
  char_type_name: string;
  line_number: number;
  page_number: number;
  code_v1: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface IChapterVerse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  words: IChapterVerseWord[];
}

interface IEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface IChapter {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  totalVerse: number;
  verses: IChapterVerse[];
  edition: IEdition;
}
