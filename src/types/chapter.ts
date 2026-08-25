export interface IWord {
  position: number;
  charType: string;
  codeV2: string;
  textUthmani: string;
  textQpcHafs: string;
  pageNumber: number;
  lineNumber: number | null;
  translation: string;
  transliteration: string;
}

export interface IVerse {
  number: number;
  key: string;
  pageNumber: number;
  words: IWord[];
}

export interface IChapterMeta {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  totalVerse: number;
}

export interface IChapter extends IChapterMeta {
  verses: IVerse[];
}

export interface ITranslationEdition {
  id: string;
  code: string;
  language: string;
  editionName: string;
}
