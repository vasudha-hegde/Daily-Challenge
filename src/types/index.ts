/**
 * Types for Smaya's Brain Quest
 * Educational web app for Year 2 (Age 6-7) UK Curriculum
 */

export type Category = 'daily' | 'maths' | 'words' | 'puzzles' | 'knowledge' | 'stars';

export type Difficulty = 'explorer' | 'adventurer' | 'champion';

export interface VisualItem {
  emoji: string;
  count: number;
  label?: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'numeric_input'
  | 'letter_fill'
  | 'word_unscramble'
  | 'sentence_builder'
  | 'odd_one_out'
  | 'pattern_complete'
  | 'comprehension'
  | 'riddle'
  | 'shape_quiz'
  | 'memory_game'
  | 'treasure_hunt';

export interface Question {
  id: string;
  category: 'maths' | 'words' | 'puzzles' | 'knowledge';
  subcategory: string;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  subprompt?: string;
  storyPassage?: string; // For reading comprehension
  contextPicture?: string; // Emoji illustration for sentence / story building
  visuals?: VisualItem[];
  options?: string[]; // For multiple choice / letter tiles / word tokens
  distractorWords?: string[]; // Plausible distractor word cards for sentence building
  correctAnswer: string | number | string[]; // Can be string, number or array of ordered tokens
  alternativeAnswers?: (string[] | string)[]; // Valid alternative grammatical orders
  hint?: string;
  hints?: string[]; // 3-stage graduated hints [meaning, category/fact, structure/letter reveal]
  explanation: string;
  rewardStars: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'maths' | 'words' | 'puzzles' | 'knowledge' | 'general';
  unlockedAt?: string | null;
  requirementText: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  category: 'maths' | 'words' | 'puzzles' | 'knowledge' | 'daily';
  questionPrompt: string;
  isCorrect: boolean;
  starsEarned: number;
}

export interface SubjectStats {
  attempts: number;
  correct: number;
}

export interface SubmittedAnswer {
  userAnswer: string | number | string[];
  isCorrect: boolean;
  hintUsed?: boolean;
}

export interface DailyChallengeState {
  sessionId: string; // Unique session ID e.g. "session-20261015-ab12cd"
  date: string; // 'YYYY-MM-DD'
  questions: Question[];
  currentIndex: number;
  completedIndices: number[];
  submittedAnswers: Record<number, SubmittedAnswer>;
  score: number;
  isCompleted: boolean;
  hintsUsed?: Record<number, boolean>;
}

export interface UserProgress {
  totalStars: number;
  mathsStars: number;
  wordStars: number;
  puzzleStars: number;
  knowledgeStars: number;
  completedQuestionIds: string[];
  openedChests: string[]; // ['chest-1', 'chest-2', 'chest-3']
  unlockedBadges: string[];
  currentStreak: number;
  bestStreak: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  lastPlayedDate: string;
  activeCategory?: Category | null;
  // Upgraded tracking
  recentQuestionIds: string[];
  dailyChallenge: DailyChallengeState | null;
  dailyChallengesCompletedCount: number;
  dailyStreak: number;
  subjectStats: {
    maths: SubjectStats;
    words: SubjectStats;
    puzzles: SubjectStats;
    knowledge: SubjectStats;
  };
  recentActivity: ActivityLogItem[];
}
