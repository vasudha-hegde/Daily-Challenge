import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Star,
  Sparkles,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Question, Difficulty } from '../../types';
import { WORD_QUESTIONS } from '../../data/wordQuestions';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { shuffleWordLetters, createScrambleTiles, ScrambleTile } from '../../utils/scrambleUtils';
import { validateSentenceAnswer } from '../../utils/sentenceUtils';

type WordActivityFilter = 'all' | 'scramble' | 'sentence' | 'comprehension' | 'spelling';

interface WordChip {
  id: string;
  word: string;
}

export const WordActivity: React.FC = () => {
  const { recordAnswer, progress, triggerConfetti } = useProgress();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('explorer');
  const [activeFilter, setActiveFilter] = useState<WordActivityFilter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // States for multiple-choice questions
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // States for Word Scramble
  const [availableScrambleTiles, setAvailableScrambleTiles] = useState<ScrambleTile[]>([]);
  const [placedScrambleTiles, setPlacedScrambleTiles] = useState<ScrambleTile[]>([]);
  const [scrambleHintLevel, setScrambleHintLevel] = useState<number>(0); // 0=hidden, 1=meaning, 2=phonics/fact, 3=reveal first letter

  // States for Sentence Building
  const [availableSentenceChips, setAvailableSentenceChips] = useState<WordChip[]>([]);
  const [placedSentenceChips, setPlacedSentenceChips] = useState<WordChip[]>([]);
  const [sentenceHintLevel, setSentenceHintLevel] = useState<number>(0); // 0=hidden, 1=starter, 2=grammar, 3=reveal first 2 words

  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter questions for the selected difficulty & activity filter
  const questions = useMemo(() => {
    let pool = WORD_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);

    if (activeFilter === 'scramble') {
      pool = pool.filter((q) => q.type === 'word_unscramble');
    } else if (activeFilter === 'sentence') {
      pool = pool.filter((q) => q.type === 'sentence_builder');
    } else if (activeFilter === 'comprehension') {
      pool = pool.filter((q) => q.type === 'comprehension');
    } else if (activeFilter === 'spelling') {
      pool = pool.filter((q) => q.type !== 'word_unscramble' && q.type !== 'sentence_builder' && q.type !== 'comprehension');
    }

    return pool.length > 0 ? pool : WORD_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty, activeFilter]);

  const currentQ = questions[currentIndex] || questions[0];

  // Initialize interactive tiles / chips whenever currentQ changes
  useEffect(() => {
    resetState();

    if (currentQ?.type === 'word_unscramble') {
      const targetWord = String(currentQ.correctAnswer).toUpperCase();
      // Use non-trivial Fisher-Yates shuffle
      const shuffledLetters = shuffleWordLetters(targetWord);
      const tiles = createScrambleTiles(shuffledLetters);
      setAvailableScrambleTiles(tiles);
      setPlacedScrambleTiles([]);
    } else if (currentQ?.type === 'sentence_builder') {
      // Gather words: options or correct tokens + distractorWords
      let wordsToUse: string[] = [];
      if (Array.isArray(currentQ.options) && currentQ.options.length > 0) {
        wordsToUse = [...currentQ.options];
      } else if (Array.isArray(currentQ.correctAnswer)) {
        wordsToUse = [...currentQ.correctAnswer];
      }

      if (currentQ.distractorWords && currentQ.distractorWords.length > 0) {
        for (const dist of currentQ.distractorWords) {
          if (!wordsToUse.includes(dist)) {
            wordsToUse.push(dist);
          }
        }
      }

      // Ensure cards are shuffled so they do not appear solved
      const shuffledChips = [...wordsToUse].sort(() => Math.random() - 0.5);
      const chips: WordChip[] = shuffledChips.map((w, idx) => ({
        id: `chip-${w}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        word: w,
      }));

      setAvailableSentenceChips(chips);
      setPlacedSentenceChips([]);
    }
  }, [currentQ?.id]);

  const handleDifficultyChange = (diff: Difficulty) => {
    sound.playPop();
    speech.stop();
    setSelectedDifficulty(diff);
    setCurrentIndex(0);
    resetState();
  };

  const handleFilterChange = (filter: WordActivityFilter) => {
    sound.playPop();
    speech.stop();
    setActiveFilter(filter);
    setCurrentIndex(0);
    resetState();
  };

  const resetState = () => {
    setSelectedChoice(null);
    setPlacedScrambleTiles([]);
    setPlacedSentenceChips([]);
    setScrambleHintLevel(0);
    setSentenceHintLevel(0);
    setHasChecked(false);
    setIsCorrect(false);
  };

  const handleReadAloud = (textToRead?: string) => {
    sound.playPop();
    setIsSpeaking(true);
    const content =
      textToRead ||
      `${currentQ.prompt}. ${currentQ.subprompt || ''} ${
        currentQ.storyPassage ? `Story: ${currentQ.storyPassage}` : ''
      }`;
    speech.speak(content, () => setIsSpeaking(false));
  };

  // --- SCRAMBLE TILE HANDLERS ---
  const handleSelectScrambleTile = (tile: ScrambleTile) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setAvailableScrambleTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setPlacedScrambleTiles((prev) => [...prev, tile]);
  };

  const handleRemovePlacedScrambleTile = (tile: ScrambleTile) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setPlacedScrambleTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableScrambleTiles((prev) => [...prev, tile]);
  };

  const handleResetScramble = () => {
    sound.playPop();
    setAvailableScrambleTiles((prev) => [...prev, ...placedScrambleTiles]);
    setPlacedScrambleTiles([]);
  };

  // --- SENTENCE CHIP HANDLERS ---
  const handleSelectSentenceChip = (chip: WordChip) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setAvailableSentenceChips((prev) => prev.filter((c) => c.id !== chip.id));
    setPlacedSentenceChips((prev) => [...prev, chip]);
  };

  const handleRemovePlacedSentenceChip = (chip: WordChip) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setPlacedSentenceChips((prev) => prev.filter((c) => c.id !== chip.id));
    setAvailableSentenceChips((prev) => [...prev, chip]);
  };

  const handleMovePlacedSentenceChip = (index: number, direction: 'left' | 'right') => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    const newPlaced = [...placedSentenceChips];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPlaced.length) return;

    const temp = newPlaced[index];
    newPlaced[index] = newPlaced[targetIndex];
    newPlaced[targetIndex] = temp;
    setPlacedSentenceChips(newPlaced);
  };

  const handleResetSentence = () => {
    sound.playPop();
    setAvailableSentenceChips((prev) => [...prev, ...placedSentenceChips]);
    setPlacedSentenceChips([]);
  };

  // --- HINT HANDLERS ---
  const handleAdvanceScrambleHint = () => {
    sound.playPop();
    setScrambleHintLevel((prev) => (prev >= 3 ? 0 : prev + 1));
  };

  const handleAdvanceSentenceHint = () => {
    sound.playPop();
    setSentenceHintLevel((prev) => (prev >= 3 ? 0 : prev + 1));
  };

  // --- CHECK ANSWER ---
  const handleCheckAnswer = () => {
    speech.stop();
    let correct = false;

    if (currentQ.type === 'word_unscramble') {
      const spelled = placedScrambleTiles.map((t) => t.letter).join('').toUpperCase();
      const target = String(currentQ.correctAnswer).toUpperCase();
      correct = spelled === target;
    } else if (currentQ.type === 'sentence_builder') {
      const candidateTokens = placedSentenceChips.map((c) => c.word);
      const targetTokens = Array.isArray(currentQ.correctAnswer)
        ? currentQ.correctAnswer
        : [currentQ.correctAnswer];
      const alternativeOrders = Array.isArray(currentQ.alternativeAnswers)
        ? (currentQ.alternativeAnswers as string[][])
        : undefined;

      correct = validateSentenceAnswer(candidateTokens, targetTokens, alternativeOrders);
    } else {
      // multiple choice or comprehension
      if (!selectedChoice) return;
      correct =
        selectedChoice.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    }

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      recordAnswer(currentQ.id, 'words', true, currentQ.rewardStars, currentQ.prompt);
      triggerConfetti();
    } else {
      recordAnswer(currentQ.id, 'words', false, currentQ.rewardStars, currentQ.prompt);
    }
  };

  const handleNext = () => {
    sound.playPop();
    speech.stop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const isCompletedAlready = progress.completedQuestionIds.includes(currentQ?.id);

  // Dynamic Hint 3 for word scramble (Reveals first letter in position)
  const scrambleHint3Text = useMemo(() => {
    if (currentQ?.type !== 'word_unscramble') return '';
    if (currentQ.hints?.[2]) return currentQ.hints[2];
    const target = String(currentQ.correctAnswer).toUpperCase();
    const firstLetter = target[0];
    const dashes = Array.from({ length: target.length - 1 })
      .map(() => '_')
      .join(' ');
    return `The word begins with "${firstLetter}": ${firstLetter} ${dashes}`;
  }, [currentQ]);

  // Dynamic Hint 3 for sentence builder (Reveals first 2 words in position)
  const sentenceHint3Text = useMemo(() => {
    if (currentQ?.type !== 'sentence_builder') return '';
    if (currentQ.hints?.[2]) return currentQ.hints[2];
    const targetArr = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer
      : [String(currentQ.correctAnswer)];
    const firstTwo = targetArr.slice(0, 2).join(' ');
    return `The sentence begins with: "${firstTwo}..."`;
  }, [currentQ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Activity Filter Tabs & Level Selector */}
      <div className="space-y-3 bg-white p-3 sm:p-4 rounded-3xl shadow-sm border-2 border-blue-200">
        {/* Difficulty Level Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(['explorer', 'adventurer', 'champion'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm capitalize transition-all border-b-2 cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-blue-600 text-white border-blue-800 shadow-sm'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {diff === 'explorer' && '🌱 Level 1: Explorer'}
                {diff === 'adventurer' && '⚡ Level 2: Adventurer'}
                {diff === 'champion' && '👑 Level 3: Champion'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-blue-900 bg-blue-100 px-3 py-1.5 rounded-full">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {isCompletedAlready && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </span>
            )}
          </div>
        </div>

        {/* Focused Activity Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-blue-100">
          <span className="text-xs font-bold text-slate-500 mr-1">Activity:</span>
          {[
            { id: 'all' as WordActivityFilter, label: '🌟 All Word Quests' },
            { id: 'scramble' as WordActivityFilter, label: '🔤 Word Scramble' },
            { id: 'sentence' as WordActivityFilter, label: '✍️ Sentence Builder' },
            { id: 'comprehension' as WordActivityFilter, label: '📖 Reading Stories' },
            { id: 'spelling' as WordActivityFilter, label: '🎯 Spelling Rules' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-blue-100 text-blue-900 border border-blue-300 font-black shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-blue-300 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full uppercase">
              {currentQ.subcategory}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              {currentQ.rewardStars} Star{currentQ.rewardStars > 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={() => handleReadAloud()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-blue-600 text-white animate-pulse'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
            }`}
            title="Read out loud in British English"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Read to me 🔊'}</span>
          </button>
        </div>

        {/* Story Reading Box for Comprehension questions */}
        {currentQ.storyPassage && (
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 shadow-inner space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Woodland Story Time</span>
              </div>
              <button
                onClick={() => handleReadAloud(`Story: ${currentQ.storyPassage}`)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                Listen to Story 🎧
              </button>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-950 leading-relaxed font-['Nunito',sans-serif]">
              &ldquo;{currentQ.storyPassage}&rdquo;
            </p>
          </div>
        )}

        {/* Context Illustration for Sentence Builder */}
        {currentQ.contextPicture && (
          <div className="flex items-center justify-center p-3 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-200 max-w-xs mx-auto text-4xl sm:text-5xl drop-shadow-sm select-none">
            {currentQ.contextPicture}
          </div>
        )}

        {/* Prompt */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
            {currentQ.prompt}
          </h2>
          {currentQ.subprompt && (
            <p className="text-base sm:text-lg font-bold text-blue-900/80">
              {currentQ.subprompt}
            </p>
          )}
        </div>

        {/* --- 1. ENHANCED WORD SCRAMBLE ACTIVITY --- */}
        {currentQ.type === 'word_unscramble' ? (
          <div className="space-y-6">
            {/* Word Built Tray */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">
                  Your Spelled Word ({placedScrambleTiles.length} of{' '}
                  {String(currentQ.correctAnswer).length} letters):
                </span>
                {placedScrambleTiles.length > 0 && !hasChecked && (
                  <button
                    onClick={handleResetScramble}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear Tiles</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 min-h-[76px] p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-dashed border-blue-300 rounded-3xl items-center justify-center shadow-inner">
                {placedScrambleTiles.length === 0 ? (
                  <span className="text-sm font-bold text-blue-400">
                    Tap the scrambled letter tiles below in order!
                  </span>
                ) : (
                  placedScrambleTiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleRemovePlacedScrambleTile(tile)}
                      disabled={hasChecked && isCorrect}
                      className="w-12 h-14 sm:w-14 sm:h-16 bg-white border-b-4 border-blue-500 rounded-2xl font-black text-2xl text-blue-900 shadow-md flex items-center justify-center hover:bg-rose-50 hover:border-rose-400 transition-all active:scale-95 cursor-pointer"
                      title="Tap to return this letter"
                    >
                      {tile.letter}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Available Shuffled Tiles */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2">Shuffled letter tiles:</p>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {availableScrambleTiles.length === 0 ? (
                  <span className="text-xs font-bold text-slate-400 italic">
                    All letter tiles placed! Tap &quot;Check Answer! ✨&quot; below.
                  </span>
                ) : (
                  availableScrambleTiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleSelectScrambleTile(tile)}
                      disabled={hasChecked && isCorrect}
                      className="w-12 h-14 sm:w-14 sm:h-16 font-black text-2xl rounded-2xl border-b-4 bg-blue-600 hover:bg-blue-700 text-white border-blue-800 shadow-sm active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {tile.letter}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 3-Level Graduated Hints Box for Scramble */}
            <AnimatePresence>
              {scrambleHintLevel > 0 && !hasChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 text-amber-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-sm text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>
                        {scrambleHintLevel === 1 && '💡 Clue 1 of 3: Word Meaning'}
                        {scrambleHintLevel === 2 && '🔍 Clue 2 of 3: Phonics & Spelling Fact'}
                        {scrambleHintLevel === 3 && '✨ Clue 3 of 3: Letter Reveal'}
                      </span>
                    </div>
                    <button
                      onClick={handleAdvanceScrambleHint}
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                    >
                      {scrambleHintLevel < 3 ? 'Next Clue ➡️' : 'Hide Clues'}
                    </button>
                  </div>

                  <p className="text-sm font-bold leading-relaxed">
                    {scrambleHintLevel === 1 &&
                      (currentQ.hints?.[0] || currentQ.subprompt || 'Think about what this word means!')}
                    {scrambleHintLevel === 2 &&
                      (currentQ.hints?.[1] || 'Look carefully at the vowels and consonants in the tiles.')}
                    {scrambleHintLevel === 3 && scrambleHint3Text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : currentQ.type === 'sentence_builder' ? (
          /* --- 2. ENHANCED SENTENCE BUILDER ACTIVITY --- */
          <div className="space-y-6">
            {/* Sentence Tray with Reordering Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Your sentence:</span>
                {placedSentenceChips.length > 0 && !hasChecked && (
                  <button
                    onClick={handleResetSentence}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear Words</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 min-h-[76px] p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-dashed border-blue-300 rounded-3xl items-center shadow-inner">
                {placedSentenceChips.length === 0 ? (
                  <span className="text-sm font-bold text-blue-400">
                    Tap the word cards below in order to build your sentence!
                  </span>
                ) : (
                  placedSentenceChips.map((chip, idx) => (
                    <div
                      key={chip.id}
                      className="flex items-center bg-white border-b-3 border-blue-500 rounded-2xl shadow-xs overflow-hidden"
                    >
                      {/* Left move arrow */}
                      {idx > 0 && !hasChecked && (
                        <button
                          onClick={() => handleMovePlacedSentenceChip(idx, 'left')}
                          className="px-1.5 py-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Move word left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Word button (tap to remove) */}
                      <button
                        onClick={() => handleRemovePlacedSentenceChip(chip)}
                        disabled={hasChecked && isCorrect}
                        className="px-3 py-2 font-bold text-base sm:text-lg text-blue-950 hover:bg-rose-50 hover:text-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Tap to return this word"
                      >
                        <span>{chip.word}</span>
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* Right move arrow */}
                      {idx < placedSentenceChips.length - 1 && !hasChecked && (
                        <button
                          onClick={() => handleMovePlacedSentenceChip(idx, 'right')}
                          className="px-1.5 py-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Move word right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Available Word Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-600">
                  Available word cards:
                  {currentQ.distractorWords && currentQ.distractorWords.length > 0 && (
                    <span className="ml-2 text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      👀 Watch out for sneaky extra cards!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center">
                {availableSentenceChips.length === 0 ? (
                  <span className="text-xs font-bold text-slate-400 italic">
                    All word cards selected! Check your sentence below.
                  </span>
                ) : (
                  availableSentenceChips.map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => handleSelectSentenceChip(chip)}
                      disabled={hasChecked && isCorrect}
                      className="px-4 py-2.5 rounded-2xl font-bold text-base sm:text-lg border-b-3 bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700 shadow-sm active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      {chip.word}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 3-Level Graduated Hints Box for Sentence Building */}
            <AnimatePresence>
              {sentenceHintLevel > 0 && !hasChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 text-amber-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-sm text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>
                        {sentenceHintLevel === 1 && '💡 Clue 1 of 3: Starter Word'}
                        {sentenceHintLevel === 2 && '🔍 Clue 2 of 3: Grammar & Structure'}
                        {sentenceHintLevel === 3 && '✨ Clue 3 of 3: Sentence Starter Reveal'}
                      </span>
                    </div>
                    <button
                      onClick={handleAdvanceSentenceHint}
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                    >
                      {sentenceHintLevel < 3 ? 'Next Clue ➡️' : 'Hide Clues'}
                    </button>
                  </div>

                  <p className="text-sm font-bold leading-relaxed">
                    {sentenceHintLevel === 1 &&
                      (currentQ.hints?.[0] || 'Look for the word starting with a capital letter to begin!')}
                    {sentenceHintLevel === 2 &&
                      (currentQ.hints?.[1] || 'Identify the action word (verb) or connecting conjunction.')}
                    {sentenceHintLevel === 3 && sentenceHint3Text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* --- 3. STANDARD MULTIPLE CHOICE (Punctuation, Phonics, Vocabulary, Comprehension) --- */
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-600">Choose the best answer:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedChoice === opt;
                let btnStyle = 'bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-300';

                if (hasChecked) {
                  if (opt === String(currentQ.correctAnswer)) {
                    btnStyle =
                      'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 font-black';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-200 border-blue-500 text-blue-950 font-black ring-2 ring-blue-400';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (!hasChecked) {
                        sound.playPop();
                        setSelectedChoice(opt);
                      }
                    }}
                    disabled={hasChecked && isCorrect}
                    className={`py-3.5 px-4 rounded-2xl text-base sm:text-lg font-bold border-2 text-center transition-all shadow-xs ${btnStyle} active:scale-98 cursor-pointer`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback & Explanation Box */}
        <AnimatePresence>
          {hasChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border-2 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-blue-50 border-blue-300 text-blue-950'
              } space-y-2`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-emerald-700">
                      Brilliant work, Smaya! That is spot on! ⭐
                    </span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-blue-800">
                      Great effort! Here is how to understand it:
                    </span>
                  </>
                )}
              </div>

              <p className="text-base font-bold leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-blue-100">
          <div>
            {!hasChecked &&
              (currentQ.type === 'word_unscramble' ? (
                <button
                  onClick={handleAdvanceScrambleHint}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    {scrambleHintLevel === 0 ? 'Need a Clue? 💡' : `Clue ${scrambleHintLevel} of 3 (Tap for next)`}
                  </span>
                </button>
              ) : currentQ.type === 'sentence_builder' ? (
                <button
                  onClick={handleAdvanceSentenceHint}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    {sentenceHintLevel === 0 ? 'Need a Clue? 💡' : `Clue ${sentenceHintLevel} of 3 (Tap for next)`}
                  </span>
                </button>
              ) : (
                currentQ.hint && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      setSentenceHintLevel((prev) => (prev > 0 ? 0 : 1));
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>{sentenceHintLevel > 0 ? 'Hide Hint' : 'Need a Hint? 💡'}</span>
                  </button>
                )
              ))}
          </div>

          <div className="flex items-center gap-3">
            {!hasChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  currentQ.type === 'word_unscramble'
                    ? placedScrambleTiles.length === 0
                    : currentQ.type === 'sentence_builder'
                    ? placedSentenceChips.length === 0
                    : !selectedChoice
                }
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                Check Answer! ✨
              </button>
            ) : !isCorrect ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    resetState();
                    if (currentQ.type === 'word_unscramble') {
                      setAvailableScrambleTiles((prev) => [...prev, ...placedScrambleTiles]);
                      setPlacedScrambleTiles([]);
                    } else if (currentQ.type === 'sentence_builder') {
                      setAvailableSentenceChips((prev) => [...prev, ...placedSentenceChips]);
                      setPlacedSentenceChips([]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl shadow-md border-b-3 border-amber-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-base rounded-2xl border-b-3 border-slate-400 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                >
                  <span>Skip to Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all animate-bounce cursor-pointer"
              >
                <span>Next Word Quest!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
