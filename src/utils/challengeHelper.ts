import { Question, DailyChallengeState, Difficulty } from '../types';
import { MATHS_QUESTIONS } from '../data/mathsQuestions';
import { WORD_QUESTIONS } from '../data/wordQuestions';
import { PUZZLE_QUESTIONS } from '../data/puzzleQuestions';
import { GENERAL_KNOWLEDGE_QUESTIONS } from '../data/generalKnowledgeQuestions';
import { generateMathsQuestion } from './mathGenerator';

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Shuffle array helper
 */
function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

/**
 * Pick an unseen question from a question pool, avoiding recentQuestionIds.
 */
export function pickUnseenQuestion(
  pool: Question[],
  recentIds: string[],
  difficulty?: Difficulty
): Question {
  const recentSet = new Set(recentIds);
  let candidates = pool.filter((q) => !recentSet.has(q.id));

  if (difficulty) {
    const diffCandidates = candidates.filter((q) => q.difficulty === difficulty);
    if (diffCandidates.length > 0) {
      candidates = diffCandidates;
    }
  }

  // If all questions were recently seen, fallback to all pool questions matching difficulty
  if (candidates.length === 0) {
    candidates = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  }

  if (candidates.length === 0) {
    candidates = pool;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Validates and sanitizes a stored daily challenge structure to ensure intact questions and data.
 * Backward-compatible with existing 10-question, 20-question, and 30-question challenges.
 */
export function isValidDailyChallenge(daily: any): daily is DailyChallengeState {
  if (!daily || typeof daily !== 'object') return false;
  if (typeof daily.date !== 'string' || daily.date.trim() === '') return false;
  if (!Array.isArray(daily.questions) || daily.questions.length === 0) return false;

  // Ensure every question in the array has at least an id, prompt, and correctAnswer
  const allQuestionsValid = daily.questions.every(
    (q: any) => q && typeof q === 'object' && typeof q.id === 'string' && typeof q.prompt === 'string'
  );
  if (!allQuestionsValid) return false;

  if (!Array.isArray(daily.completedIndices)) return false;
  if (typeof daily.submittedAnswers !== 'object' || daily.submittedAnswers === null) return false;

  // Sanitize optional fields if missing from storage
  if (!daily.sessionId || typeof daily.sessionId !== 'string') {
    daily.sessionId = `daily-${daily.date}-${Date.now()}`;
  }
  if (!daily.hintsUsed || typeof daily.hintsUsed !== 'object') {
    daily.hintsUsed = {};
  }
  if (typeof daily.score !== 'number') {
    daily.score = 0;
  }
  if (typeof daily.isCompleted !== 'boolean') {
    daily.isCompleted = daily.completedIndices.length >= daily.questions.length;
  }
  if (
    typeof daily.currentIndex !== 'number' ||
    daily.currentIndex < 0 ||
    daily.currentIndex >= daily.questions.length
  ) {
    daily.currentIndex = daily.isCompleted ? Math.max(0, daily.questions.length - 1) : 0;
  }

  return true;
}

/**
 * Calculates the exact index where the child left off in an unfinished challenge.
 * If questions 1, 2, and 3 are completed (indices 0, 1, 2), this returns index 3 (Question 4).
 * If the challenge is completed, it retains the final question index.
 */
export function getChallengeResumeIndex(daily: DailyChallengeState | null | undefined): number {
  if (!daily || !daily.questions || daily.questions.length === 0) return 0;

  // If completed, keep the final question / review index
  if (daily.isCompleted || daily.completedIndices.length >= daily.questions.length) {
    return Math.max(0, daily.questions.length - 1);
  }

  const currentIdx = typeof daily.currentIndex === 'number' ? daily.currentIndex : 0;

  // 1. If daily.currentIndex points to an unanswered question and is within bounds, resume exactly there
  if (
    currentIdx >= 0 &&
    currentIdx < daily.questions.length &&
    !daily.completedIndices.includes(currentIdx)
  ) {
    return currentIdx;
  }

  // 2. If currentIdx was just answered, advance to the next question if unanswered
  if (currentIdx + 1 < daily.questions.length && !daily.completedIndices.includes(currentIdx + 1)) {
    return currentIdx + 1;
  }

  // 3. Otherwise find the first question that has not yet been answered
  for (let i = 0; i < daily.questions.length; i++) {
    if (!daily.completedIndices.includes(i)) {
      return i;
    }
  }

  return Math.min(Math.max(0, currentIdx), daily.questions.length - 1);
}

/**
 * Creates a balanced 30-question Daily Challenge:
 * - 8 Maths questions (4 dynamically generated procedural + 4 curated from bank)
 * - 6 English questions (Word Wizard: 2 explorer, 2 adventurer, 2 champion)
 * - 6 Puzzle Island questions (2 explorer, 2 adventurer, 2 champion)
 * - 10 General Knowledge questions (1 from each distinct curriculum topic, ages 8-9 Year 3)
 * Total = 30 questions
 */
export function createFreshDailyChallenge(recentIds: string[]): DailyChallengeState {
  const today = getTodayDateString();
  const chosenRecent = [...recentIds];

  const questions: Question[] = [];

  // 1. Four Procedural Maths questions (2 explorer, 1 adventurer, 1 champion)
  const math1 = generateMathsQuestion('explorer');
  const math2 = generateMathsQuestion('explorer');
  const math3 = generateMathsQuestion('adventurer');
  const math4 = generateMathsQuestion('champion');
  questions.push(math1, math2, math3, math4);

  // 2. Four Curated Maths questions (2 explorer, 1 adventurer, 1 champion)
  const curMath1 = pickUnseenQuestion(MATHS_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(curMath1.id);
  const curMath2 = pickUnseenQuestion(MATHS_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(curMath2.id);
  const curMath3 = pickUnseenQuestion(MATHS_QUESTIONS, chosenRecent, 'adventurer');
  chosenRecent.push(curMath3.id);
  const curMath4 = pickUnseenQuestion(MATHS_QUESTIONS, chosenRecent, 'champion');
  chosenRecent.push(curMath4.id);
  questions.push(curMath1, curMath2, curMath3, curMath4);

  // 3. Six Word Wizard questions (2 explorer, 2 adventurer, 2 champion)
  const word1 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(word1.id);
  const word2 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(word2.id);
  const word3 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'adventurer');
  chosenRecent.push(word3.id);
  const word4 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'adventurer');
  chosenRecent.push(word4.id);
  const word5 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'champion');
  chosenRecent.push(word5.id);
  const word6 = pickUnseenQuestion(WORD_QUESTIONS, chosenRecent, 'champion');
  chosenRecent.push(word6.id);
  questions.push(word1, word2, word3, word4, word5, word6);

  // 4. Six Puzzle Island questions (2 explorer, 2 adventurer, 2 champion)
  const puz1 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(puz1.id);
  const puz2 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'explorer');
  chosenRecent.push(puz2.id);
  const puz3 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'adventurer');
  chosenRecent.push(puz3.id);
  const puz4 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'adventurer');
  chosenRecent.push(puz4.id);
  const puz5 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'champion');
  chosenRecent.push(puz5.id);
  const puz6 = pickUnseenQuestion(PUZZLE_QUESTIONS, chosenRecent, 'champion');
  chosenRecent.push(puz6.id);
  questions.push(puz1, puz2, puz3, puz4, puz5, puz6);

  // 5. Ten General Knowledge questions across 10 diverse topics
  const gkTopics: { topic: string; difficulty?: Difficulty }[] = [
    { topic: 'Science & Nature', difficulty: 'explorer' },
    { topic: 'Space & Planets', difficulty: 'explorer' },
    { topic: 'Animals & Habitats', difficulty: 'explorer' },
    { topic: 'Geography & Landmarks', difficulty: 'explorer' },
    { topic: 'History & Inventions', difficulty: 'adventurer' },
    { topic: 'Human Body & Health', difficulty: 'adventurer' },
    { topic: 'Weather & Environment', difficulty: 'adventurer' },
    { topic: 'Technology & Life', difficulty: 'champion' },
    { topic: 'Arts & Culture', difficulty: 'champion' },
    { topic: 'Sport & World Facts', difficulty: 'champion' },
  ];

  for (const item of gkTopics) {
    const topicPool = GENERAL_KNOWLEDGE_QUESTIONS.filter((q) => q.subcategory === item.topic);
    const chosenQ = pickUnseenQuestion(topicPool, chosenRecent, item.difficulty);
    chosenRecent.push(chosenQ.id);
    questions.push(chosenQ);
  }

  // Shuffle the 30 questions so the daily adventure is a lively, varied mix of subjects!
  const mixedQuestions = shuffle(questions);
  const sessionId = `daily-${today}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return {
    sessionId,
    date: today,
    questions: mixedQuestions,
    currentIndex: 0,
    completedIndices: [],
    submittedAnswers: {},
    hintsUsed: {},
    score: 0,
    isCompleted: false,
  };
}
