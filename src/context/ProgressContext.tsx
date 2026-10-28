import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ALL_BADGES, TREASURE_CHESTS, TreasureChestInfo } from '../data/badges';
import { Badge, Category, DailyChallengeState, UserProgress, ActivityLogItem } from '../types';
import { sound } from '../utils/sound';
import {
  getTodayDateString,
  createFreshDailyChallenge,
  getChallengeResumeIndex,
  isValidDailyChallenge,
} from '../utils/challengeHelper';

interface CelebrationData {
  title: string;
  subtitle: string;
  icon: string;
  starsAdded?: number;
}

interface ProgressContextType {
  progress: UserProgress;
  recordAnswer: (
    questionId: string,
    category: 'maths' | 'words' | 'puzzles' | 'knowledge',
    isCorrect: boolean,
    rewardStars: number,
    questionPrompt?: string
  ) => boolean;
  recordDailyChallengeAnswer: (
    questionIndex: number,
    isCorrect: boolean,
    rewardStars: number,
    userAnswer: string | number | string[],
    questionPrompt?: string,
    hintUsed?: boolean
  ) => void;
  recordDailyChallengeHintUsed: (questionIndex: number) => void;
  setDailyChallengeCurrentIndex: (index: number) => void;
  setActiveCategory: (category: Category | null) => void;
  startNewDailyChallenge: () => void;
  resetProgress: () => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  badges: Badge[];
  chests: TreasureChestInfo[];
  celebration: CelebrationData | null;
  clearCelebration: () => void;
  triggerConfetti: () => void;
  currentRank: { title: string; icon: string; nextRankAt: number };
  openChest: (chestId: string) => boolean;
  storageWarning: boolean;
  dismissStorageWarning: () => void;
}

const STORAGE_KEY = 'smayas_brain_quest_save_v2';
const LEGACY_STORAGE_KEYS = ['smayas_brain_quest_save', 'smayas_brain_quest_save_v1'];

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__sbq_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

let globalStorageErrorHandler: (() => void) | null = null;

const defaultProgress: UserProgress = {
  totalStars: 0,
  mathsStars: 0,
  wordStars: 0,
  puzzleStars: 0,
  knowledgeStars: 0,
  completedQuestionIds: [],
  openedChests: [],
  unlockedBadges: [],
  currentStreak: 0,
  bestStreak: 0,
  soundEnabled: true,
  voiceEnabled: true,
  lastPlayedDate: new Date().toISOString(),
  activeCategory: null,
  recentQuestionIds: [],
  dailyChallenge: null,
  dailyChallengesCompletedCount: 0,
  dailyStreak: 0,
  subjectStats: {
    maths: { attempts: 0, correct: 0 },
    words: { attempts: 0, correct: 0 },
    puzzles: { attempts: 0, correct: 0 },
    knowledge: { attempts: 0, correct: 0 },
  },
  recentActivity: [],
};

/**
 * Synchronous and safe persistence helper.
 * Immediately commits state to localStorage to prevent data loss on refresh or navigation.
 * Writes to primary key and legacy aliases for maximum compatibility.
 */
function saveProgressToStorage(data: UserProgress) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    for (const altKey of LEGACY_STORAGE_KEYS) {
      try {
        localStorage.setItem(altKey, serialized);
      } catch {
        // Ignore secondary key quota errors
      }
    }
  } catch (err) {
    console.error('Error saving progress to localStorage:', err);
    if (globalStorageErrorHandler) {
      globalStorageErrorHandler();
    }
  }
}

/**
 * Safely loads and migrates the initial state on app boot.
 * Guarantees that today's unfinished daily challenge is never overwritten on refresh or remount.
 */
function loadInitialProgress(): UserProgress {
  const today = getTodayDateString();
  try {
    let saved: string | null = null;
    const keysToTry = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    for (const key of keysToTry) {
      const val = localStorage.getItem(key);
      if (val) {
        saved = val;
        break;
      }
    }

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const merged: UserProgress = {
          ...defaultProgress,
          ...parsed,
          knowledgeStars: typeof parsed.knowledgeStars === 'number' ? parsed.knowledgeStars : 0,
          subjectStats: {
            ...defaultProgress.subjectStats,
            ...(parsed.subjectStats || {}),
            knowledge: parsed.subjectStats?.knowledge || { attempts: 0, correct: 0 },
          },
        };

        // Check if there is an existing challenge for today
        if (isValidDailyChallenge(merged.dailyChallenge) && merged.dailyChallenge.date === today) {
          // Unfinished or completed: ensure currentIndex is positioned exactly where the child left off
          const resumeIdx = getChallengeResumeIndex(merged.dailyChallenge);
          merged.dailyChallenge = {
            ...merged.dailyChallenge,
            currentIndex: resumeIdx,
          };
          saveProgressToStorage(merged);
          return merged;
        } else {
          // A new calendar day has started or no valid challenge exists yet for today
          // Preserve all historical stars, badges, chests, streaks and stats!
          const fresh = createFreshDailyChallenge(merged.recentQuestionIds || []);
          merged.dailyChallenge = fresh;
          saveProgressToStorage(merged);
          return merged;
        }
      }
    }
  } catch (err) {
    console.error('Error reading saved progress from storage:', err);
  }

  // Fallback default state
  const initial: UserProgress = { ...defaultProgress };
  initial.dailyChallenge = createFreshDailyChallenge([]);
  saveProgressToStorage(initial);
  return initial;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(loadInitialProgress);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const [storageWarning, setStorageWarning] = useState<boolean>(() => !isLocalStorageAvailable());

  useEffect(() => {
    globalStorageErrorHandler = () => {
      setStorageWarning(true);
    };
    return () => {
      globalStorageErrorHandler = null;
    };
  }, []);

  // Keep sound engine synced
  useEffect(() => {
    sound.setEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // Ignore
    }
  };

  const getRank = (stars: number) => {
    if (stars >= 50) return { title: 'Grand Quest Champion', icon: '👑', nextRankAt: 999 };
    if (stars >= 35) return { title: 'Galaxy Adventurer', icon: '🚀', nextRankAt: 50 };
    if (stars >= 20) return { title: 'Master Detective', icon: '🦉', nextRankAt: 35 };
    if (stars >= 10) return { title: 'Star Explorer', icon: '🌟', nextRankAt: 20 };
    return { title: 'Curious Cub', icon: '🐾', nextRankAt: 10 };
  };

  const checkBadgeUnlocks = (newProg: UserProgress) => {
    const newlyUnlocked: Badge[] = [];
    const currentUnlockedIds = new Set(newProg.unlockedBadges);

    ALL_BADGES.forEach((b) => {
      if (currentUnlockedIds.has(b.id)) return;

      let shouldUnlock = false;
      if (b.id === 'first_step' && newProg.totalStars >= 1) shouldUnlock = true;
      if (b.id === 'maths_spark' && newProg.mathsStars >= 5) shouldUnlock = true;
      if (b.id === 'maths_wizard' && newProg.mathsStars >= 12) shouldUnlock = true;
      if (b.id === 'word_scout' && newProg.wordStars >= 5) shouldUnlock = true;
      if (b.id === 'bookworm' && newProg.wordStars >= 12) shouldUnlock = true;
      if (b.id === 'puzzle_solver' && newProg.puzzleStars >= 5) shouldUnlock = true;
      if (b.id === 'treasure_finder' && newProg.completedQuestionIds.includes('puzzle-17')) shouldUnlock = true;
      if (b.id === 'curious_explorer' && newProg.knowledgeStars >= 5) shouldUnlock = true;
      if (b.id === 'world_whizz' && newProg.knowledgeStars >= 12) shouldUnlock = true;
      if (b.id === 'streak_hero' && newProg.bestStreak >= 3) shouldUnlock = true;
      if (b.id === 'star_hoarder' && newProg.totalStars >= 15) shouldUnlock = true;
      if (b.id === 'galaxy_hero' && newProg.totalStars >= 35) shouldUnlock = true;
      if (b.id === 'chest_master' && newProg.openedChests.length >= 3) shouldUnlock = true;
      if (b.id === 'daily_first' && newProg.dailyChallengesCompletedCount >= 1) shouldUnlock = true;
      if (b.id === 'daily_streak_3' && newProg.dailyChallengesCompletedCount >= 3) shouldUnlock = true;

      if (shouldUnlock) {
        newlyUnlocked.push(b);
        currentUnlockedIds.add(b.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      const firstBadge = newlyUnlocked[0];
      setCelebration({
        title: `Badge Unlocked: ${firstBadge.title}!`,
        subtitle: firstBadge.description,
        icon: firstBadge.icon,
      });
      triggerConfetti();
      sound.playSuccess();
    }

    return Array.from(currentUnlockedIds);
  };

  const recordAnswer = (
    questionId: string,
    category: 'maths' | 'words' | 'puzzles' | 'knowledge',
    isCorrect: boolean,
    rewardStars: number,
    questionPrompt?: string
  ): boolean => {
    const alreadyCompleted = progress.completedQuestionIds.includes(questionId);
    const starsToAward = isCorrect && !alreadyCompleted ? rewardStars : 0;

    let updatedProg: UserProgress = progress;

    setProgress((prev) => {
      const nextStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      const nextCompleted = isCorrect && !alreadyCompleted
        ? [...prev.completedQuestionIds, questionId]
        : prev.completedQuestionIds;

      const filteredRecent = prev.recentQuestionIds.filter((id) => id !== questionId);
      const nextRecent = [questionId, ...filteredRecent].slice(0, 40);

      const currentSubj = prev.subjectStats[category] || { attempts: 0, correct: 0 };
      const nextSubj = {
        attempts: currentSubj.attempts + 1,
        correct: isCorrect ? currentSubj.correct + 1 : currentSubj.correct,
      };

      const activityItem: ActivityLogItem = {
        id: `act-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        category,
        questionPrompt: questionPrompt || `${category.toUpperCase()} question`,
        isCorrect,
        starsEarned: starsToAward,
      };

      const nextProg: UserProgress = {
        ...prev,
        totalStars: prev.totalStars + starsToAward,
        mathsStars: category === 'maths' ? prev.mathsStars + starsToAward : prev.mathsStars,
        wordStars: category === 'words' ? prev.wordStars + starsToAward : prev.wordStars,
        puzzleStars: category === 'puzzles' ? prev.puzzleStars + starsToAward : prev.puzzleStars,
        knowledgeStars: category === 'knowledge' ? (prev.knowledgeStars || 0) + starsToAward : (prev.knowledgeStars || 0),
        completedQuestionIds: nextCompleted,
        recentQuestionIds: nextRecent,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        subjectStats: {
          ...prev.subjectStats,
          [category]: nextSubj,
        },
        recentActivity: [activityItem, ...prev.recentActivity].slice(0, 30),
        lastPlayedDate: new Date().toISOString(),
      };

      nextProg.unlockedBadges = checkBadgeUnlocks(nextProg);
      updatedProg = nextProg;
      saveProgressToStorage(nextProg); // Immediately persist!
      return nextProg;
    });

    if (isCorrect) {
      sound.playStarDing();
    } else {
      sound.playEncouragingRetry();
    }

    return !alreadyCompleted;
  };

  const recordDailyChallengeAnswer = (
    questionIndex: number,
    isCorrect: boolean,
    rewardStars: number,
    userAnswer: string | number | string[],
    questionPrompt?: string,
    hintUsed?: boolean
  ) => {
    if (!progress.dailyChallenge) return;

    const currentQ = progress.dailyChallenge.questions[questionIndex];
    if (!currentQ) return;

    const cat = currentQ.category;

    setProgress((prev) => {
      if (!prev.dailyChallenge) return prev;

      const daily = prev.dailyChallenge;
      const alreadyCompletedThisQ = daily.completedIndices.includes(questionIndex);
      const nextCompletedIndices = alreadyCompletedThisQ
        ? daily.completedIndices
        : [...daily.completedIndices, questionIndex];

      // Prevent duplicate stars if refreshed or resubmitted
      const starsToAward = isCorrect && !alreadyCompletedThisQ ? rewardStars : 0;
      const isFinishedNow = nextCompletedIndices.length === daily.questions.length;
      const bonusStars = isFinishedNow && !daily.isCompleted ? 5 : 0;

      const nextSubmittedAnswers = {
        ...(daily.submittedAnswers || {}),
        [questionIndex]: { userAnswer, isCorrect, hintUsed: Boolean(hintUsed) },
      };

      const nextHintsUsed = {
        ...(daily.hintsUsed || {}),
        ...(hintUsed ? { [questionIndex]: true } : {}),
      };

      // Calculate next question index: advance to next question or next unfinished
      let nextIndex = questionIndex;
      if (!isFinishedNow) {
        if (questionIndex + 1 < daily.questions.length && !nextCompletedIndices.includes(questionIndex + 1)) {
          nextIndex = questionIndex + 1;
        } else {
          for (let i = 0; i < daily.questions.length; i++) {
            if (!nextCompletedIndices.includes(i)) {
              nextIndex = i;
              break;
            }
          }
        }
      }

      const nextDaily: DailyChallengeState = {
        ...daily,
        currentIndex: nextIndex,
        completedIndices: nextCompletedIndices,
        submittedAnswers: nextSubmittedAnswers,
        hintsUsed: nextHintsUsed,
        score: daily.score + (isCorrect && !alreadyCompletedThisQ ? 1 : 0),
        isCompleted: isFinishedNow || daily.isCompleted,
      };

      const currentSubj = prev.subjectStats[cat] || { attempts: 0, correct: 0 };
      const nextSubj = {
        attempts: currentSubj.attempts + 1,
        correct: isCorrect ? currentSubj.correct + 1 : currentSubj.correct,
      };

      const activityItem: ActivityLogItem = {
        id: `act-daily-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        category: 'daily',
        questionPrompt: questionPrompt || `Daily Quest: ${currentQ.prompt}`,
        isCorrect,
        starsEarned: starsToAward + bonusStars,
      };

      const nextProg: UserProgress = {
        ...prev,
        totalStars: prev.totalStars + starsToAward + bonusStars,
        mathsStars: cat === 'maths' ? prev.mathsStars + starsToAward : prev.mathsStars,
        wordStars: cat === 'words' ? prev.wordStars + starsToAward : prev.wordStars,
        puzzleStars: cat === 'puzzles' ? prev.puzzleStars + starsToAward : prev.puzzleStars,
        knowledgeStars: cat === 'knowledge' ? (prev.knowledgeStars || 0) + starsToAward : (prev.knowledgeStars || 0),
        activeCategory: 'daily', // Stay locked into daily challenge mode
        dailyChallenge: nextDaily,
        dailyChallengesCompletedCount:
          isFinishedNow && !daily.isCompleted
            ? prev.dailyChallengesCompletedCount + 1
            : prev.dailyChallengesCompletedCount,
        subjectStats: {
          ...prev.subjectStats,
          [cat]: nextSubj,
        },
        recentActivity: [activityItem, ...prev.recentActivity].slice(0, 30),
        lastPlayedDate: new Date().toISOString(),
      };

      nextProg.unlockedBadges = checkBadgeUnlocks(nextProg);
      saveProgressToStorage(nextProg); // Synchronously save immediately!
      return nextProg;
    });

    if (isCorrect) {
      sound.playStarDing();
    } else {
      sound.playEncouragingRetry();
    }
  };

  const recordDailyChallengeHintUsed = (questionIndex: number) => {
    setProgress((prev) => {
      if (!prev.dailyChallenge) return prev;
      const nextDaily: DailyChallengeState = {
        ...prev.dailyChallenge,
        hintsUsed: {
          ...(prev.dailyChallenge.hintsUsed || {}),
          [questionIndex]: true,
        },
      };
      const nextProg: UserProgress = {
        ...prev,
        dailyChallenge: nextDaily,
      };
      saveProgressToStorage(nextProg);
      return nextProg;
    });
  };

  const setDailyChallengeCurrentIndex = (index: number) => {
    setProgress((prev) => {
      if (!prev.dailyChallenge) return prev;
      const nextDaily = {
        ...prev.dailyChallenge,
        currentIndex: index,
      };
      const nextProg = {
        ...prev,
        dailyChallenge: nextDaily,
      };
      saveProgressToStorage(nextProg); // Persist index immediately!
      return nextProg;
    });
  };

  const setActiveCategory = (category: Category | null) => {
    setProgress((prev) => {
      if (prev.activeCategory === category) return prev;
      const nextProg = {
        ...prev,
        activeCategory: category,
      };
      saveProgressToStorage(nextProg);
      return nextProg;
    });
  };

  const startNewDailyChallenge = () => {
    setProgress((prev) => {
      const fresh = createFreshDailyChallenge(prev.recentQuestionIds || []);
      const nextProg: UserProgress = {
        ...prev,
        activeCategory: 'daily',
        dailyChallenge: fresh,
      };
      saveProgressToStorage(nextProg);
      return nextProg;
    });
  };

  const openChest = (chestId: string): boolean => {
    const chest = TREASURE_CHESTS.find((c) => c.id === chestId);
    if (!chest) return false;
    if (progress.totalStars < chest.starsRequired) return false;
    if (progress.openedChests.includes(chestId)) return false;

    const bonus = 3;

    setProgress((prev) => {
      const nextChests = [...prev.openedChests, chestId];
      const nextProg: UserProgress = {
        ...prev,
        totalStars: prev.totalStars + bonus,
        openedChests: nextChests,
      };
      nextProg.unlockedBadges = checkBadgeUnlocks(nextProg);
      saveProgressToStorage(nextProg);
      return nextProg;
    });

    sound.playChestFanfare();
    triggerConfetti();

    setCelebration({
      title: `${chest.name} Unlocked!`,
      subtitle: `Splendid! You received: ${chest.rewardName}`,
      icon: chest.rewardIcon,
      starsAdded: bonus,
    });

    return true;
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    for (const altKey of LEGACY_STORAGE_KEYS) {
      try {
        localStorage.removeItem(altKey);
      } catch {
        // ignore
      }
    }
    const fresh = { ...defaultProgress };
    fresh.dailyChallenge = createFreshDailyChallenge([]);
    saveProgressToStorage(fresh);
    setProgress(fresh);
    setCelebration(null);
  };

  const toggleSound = () => {
    setProgress((prev) => {
      const next = !prev.soundEnabled;
      sound.setEnabled(next);
      const nextProg = { ...prev, soundEnabled: next };
      saveProgressToStorage(nextProg);
      return nextProg;
    });
  };

  const toggleVoice = () => {
    setProgress((prev) => {
      const nextProg = {
        ...prev,
        voiceEnabled: !prev.voiceEnabled,
      };
      saveProgressToStorage(nextProg);
      return nextProg;
    });
  };

  const clearCelebration = () => setCelebration(null);

  const badges = ALL_BADGES.map((b) => ({
    ...b,
    unlockedAt: progress.unlockedBadges.includes(b.id) ? 'unlocked' : null,
  }));

  const currentRank = getRank(progress.totalStars);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        recordAnswer,
        recordDailyChallengeAnswer,
        recordDailyChallengeHintUsed,
        setDailyChallengeCurrentIndex,
        setActiveCategory,
        startNewDailyChallenge,
        openChest,
        resetProgress,
        toggleSound,
        toggleVoice,
        badges,
        chests: TREASURE_CHESTS,
        celebration,
        clearCelebration,
        triggerConfetti,
        currentRank,
        storageWarning,
        dismissStorageWarning: () => setStorageWarning(false),
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};
