import { useQuery } from '@tanstack/react-query';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface SurahWithTranslation {
  arabic: SurahDetail;
  translation: SurahDetail;
}

export function useSurahs() {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      return data.data as SurahMeta[];
    }
  });
}

export function useSurahDetail(number: number) {
  return useQuery({
    queryKey: ['surah', number],
    queryFn: async () => {
      if (!number) return null;
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.asad`);
      const data = await res.json();
      return {
        arabic: data.data[0],
        translation: data.data[1]
      } as SurahWithTranslation;
    },
    enabled: !!number
  });
}

export function useRandomAyah() {
  return useQuery({
    queryKey: ['random-ayah'],
    queryFn: async () => {
      // Pick a random surah 1-114
      const surahNum = Math.floor(Math.random() * 114) + 1;
      const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`);
      const surahData = await surahRes.json();
      const numAyahs = surahData.data.numberOfAyahs;
      
      const ayahNum = Math.floor(Math.random() * numAyahs) + 1;
      
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/en.asad`)
      ]);
      
      const arData = await arRes.json();
      const enData = await enRes.json();
      
      return {
        surah: surahData.data,
        arabic: arData.data,
        translation: enData.data
      };
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
