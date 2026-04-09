import { useState, useEffect, useCallback } from 'react';

export interface Bookmark {
  surah: number;
  ayah: number;
  text: string;
  translation: string;
  surahName: string;
}

export interface QuizResult {
  date: string;
  score: number;
  total: number;
  xpEarned: number;
}

export interface ProgressState {
  readAyahs: string[]; // Set stored as array "surahNum:ayahNum"
  bookmarks: Bookmark[];
  streak: { count: number; lastDate: string | null };
  xp: number;
  level: number;
  quizHistory: QuizResult[];
  achievements: string[];
}

const DEFAULT_STATE: ProgressState = {
  readAyahs: [],
  bookmarks: [],
  streak: { count: 0, lastDate: null },
  xp: 0,
  level: 1,
  quizHistory: [],
  achievements: []
};

const STORAGE_KEY = 'quran_quest_progress';

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse progress from local storage', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Streak logic on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const lastDate = prev.streak.lastDate;
      if (!lastDate) {
        return { ...prev, streak: { count: 1, lastDate: today } };
      }
      if (lastDate === today) return prev; // Already updated today

      const last = new Date(lastDate);
      const current = new Date(today);
      const diffTime = Math.abs(current.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return { ...prev, streak: { count: prev.streak.count + 1, lastDate: today } };
      } else {
        return { ...prev, streak: { count: 1, lastDate: today } };
      }
    });
  }, []);

  const checkAchievements = useCallback((newState: ProgressState) => {
    const newAchievements = [...newState.achievements];
    const addAchievement = (id: string, xpReward: number) => {
      if (!newAchievements.includes(id)) {
        newAchievements.push(id);
        newState.xp += xpReward;
      }
    };

    if (newState.readAyahs.length >= 50) addAchievement('bookworm_50', 500);
    if (newState.streak.count >= 7) addAchievement('streak_7', 700);
    
    const readSurahs = new Set(newState.readAyahs.map(a => a.split(':')[0])).size;
    if (readSurahs >= 5) addAchievement('surahs_5', 500);

    const perfectQuizzes = newState.quizHistory.filter(q => q.score === q.total && q.total > 0).length;
    if (perfectQuizzes >= 1) addAchievement('quiz_master', 300);

    newState.achievements = newAchievements;
    newState.level = Math.floor(newState.xp / 1000) + 1;
    return newState;
  }, []);

  const markAyahRead = useCallback((surah: number, ayah: number) => {
    setState(prev => {
      const key = `${surah}:${ayah}`;
      if (prev.readAyahs.includes(key)) return prev;
      
      const newState = {
        ...prev,
        readAyahs: [...prev.readAyahs, key],
        xp: prev.xp + 10
      };
      return checkAchievements(newState);
    });
  }, [checkAchievements]);

  const isAyahRead = useCallback((surah: number, ayah: number) => {
    return state.readAyahs.includes(`${surah}:${ayah}`);
  }, [state.readAyahs]);

  const toggleBookmark = useCallback((bookmark: Bookmark) => {
    setState(prev => {
      const exists = prev.bookmarks.some(b => b.surah === bookmark.surah && b.ayah === bookmark.ayah);
      if (exists) {
        return { ...prev, bookmarks: prev.bookmarks.filter(b => !(b.surah === bookmark.surah && b.ayah === bookmark.ayah)) };
      } else {
        return { ...prev, bookmarks: [...prev.bookmarks, bookmark] };
      }
    });
  }, []);

  const isBookmarked = useCallback((surah: number, ayah: number) => {
    return state.bookmarks.some(b => b.surah === surah && b.ayah === ayah);
  }, [state.bookmarks]);

  const addQuizResult = useCallback((score: number, total: number) => {
    setState(prev => {
      const xpEarned = score * 50;
      const newState = {
        ...prev,
        xp: prev.xp + xpEarned,
        quizHistory: [...prev.quizHistory, { date: new Date().toISOString(), score, total, xpEarned }]
      };
      return checkAchievements(newState);
    });
  }, [checkAchievements]);

  return {
    state,
    markAyahRead,
    isAyahRead,
    toggleBookmark,
    isBookmarked,
    addQuizResult
  };
}
