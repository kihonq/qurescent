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

export enum SurahCode {
  "ﷄ",
  "ﷅ",
  "ﷆ",
  "ﷇ",
  "ﷰ",
  "ﷱ",
  "ﷳ",
  "ﷴ",
  "ﷵ",
  "ﷶ",
  "ﷷ",
  "ﷸ",
  "ﷹ",
  "﷼",
  "ﰆ",
  "ﰇ",
  "ﰋ",
  "ﰌ",
  "ﰍ",
  "ﰏ",
  "ﰑ",
  "ﰓ",
  "ﰔ",
  "ﰕ",
  "ﰖ",
  "ﳖ",
  "ﳗ",
  "ﳙ",
  "ﳞ",
  "ﳟ",
  "ﳠ",
  "ﳡ",
  "ﳢ",
  "ﳣ",
  "ﳤ",
  "ﳥ",
  "ﳦ",
  "ﳧ",
  "ﳨ",
  "ﳩ",
  "ﳪ",
  "ﳫ",
  "ﳬ",
  "ﳭ",
  "ﳮ",
  "ﳯ",
  "ﳰ",
  "ﳱ",
  "ﳵ",
  "ﳶ",
  "ﳷ",
  "ﳸ",
  "ﳹ",
  "ﳺ",
  "ﳻ",
  "ﳼ",
  "ﳽ",
  "ﳾ",
  "ﳿ",
  "ﴀ",
  "ﴁ",
  "ﴂ",
  "ﴃ",
  "ﴄ",
  "ﴅ",
  "ﴆ",
  "ﴇ",
  "ﴈ",
  "ﴉ",
  "ﴊ",
  "ﴋ",
  "ﴌ",
  "ﴍ",
  "ﴎ",
  "ﴏ",
  "ﴐ",
  "ﴑ",
  "ﴒ",
  "ﴓ",
  "ﴔ",
  "ﴕ",
  "ﴖ",
  "ﴗ",
  "ﴘ",
  "ﴙ",
  "ﴚ",
  "ﴛ",
  "ﴜ",
  "ﴝ",
  "ﴞ",
  "ﴟ",
  "ﴠ",
  "ﴡ",
  "ﴢ",
  "ﴣ",
  "ﴤ",
  "ﴥ",
  "ﴦ",
  "ﴧ",
  "ﴨ",
  "ﴩ",
  "ﴪ",
  "ﴫ",
  "ﴬ",
  "ﴭ",
  "ﴮ",
  "ﴯ",
  "ﴱ",
  "ﴲ",
  "ﴳ",
  "ﴴ",
  "ﴵ",
  "ﴶ",
  "ﴷ",
}
