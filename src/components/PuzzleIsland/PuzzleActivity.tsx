import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, HelpCircle, Star, Sparkles, Compass, Gamepad2 } from 'lucide-react';
import { Question, Difficulty } from '../../types';
import { PUZZLE_QUESTIONS } from '../../data/puzzleQuestions';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';
import { speech } from '../../utils/speech';

// Memory match cards game state
interface MemoryCard {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_ITEMS = [
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🦔', name: 'Hedgehog' },
  { emoji: '🐰', name: 'Rabbit' },
  { emoji: '🐿️', name: 'Squirrel' },
  { emoji: '🦡', name: 'Badger' },
];

export const PuzzleActivity: React.FC = () => {
  const { recordAnswer, progress, triggerConfetti } = useProgress();

  const [activeTab, setActiveTab] = useState<'riddles' | 'memory'>('riddles');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('explorer');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Memory card game states
  const [cards, setCards] = useState<MemoryCard[]>(() => initMemoryCards());
  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);
  const [memoryMatchesCount, setMemoryMatchesCount] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  function initMemoryCards(): MemoryCard[] {
    const pairs = [...MEMORY_ITEMS, ...MEMORY_ITEMS];
    // Shuffle
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((item, index) => ({
      id: index,
      emoji: item.emoji,
      name: item.name,
      isFlipped: false,
      isMatched: false,
    }));
  }

  const restartMemoryGame = () => {
    sound.playPop();
    setCards(initMemoryCards());
    setSelectedCardIndices([]);
    setMemoryMatchesCount(0);
    setMemoryWon(false);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCardIndices.length >= 2) {
      return;
    }

    sound.playCardFlip();
    const newIndices = [...selectedCardIndices, index];

    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );
    setSelectedCardIndices(newIndices);

    if (newIndices.length === 2) {
      const first = cards[newIndices[0]];
      const second = cards[newIndices[1]];

      if (first.emoji === second.emoji) {
        // Match!
        setTimeout(() => {
          sound.playStarDing();
          setCards((prev) =>
            prev.map((c, i) =>
              i === newIndices[0] || i === newIndices[1]
                ? { ...c, isMatched: true }
                : c
            )
          );
          setSelectedCardIndices([]);
          setMemoryMatchesCount((prev) => {
            const next = prev + 1;
            if (next === MEMORY_ITEMS.length) {
              // Game won!
              setMemoryWon(true);
              recordAnswer('memory-game-bonus', 'puzzles', true, 3, 'Animal Pairs Memory Challenge');
              triggerConfetti();
            }
            return next;
          });
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === newIndices[0] || i === newIndices[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCardIndices([]);
        }, 900);
      }
    }
  };

  // Filter questions for the selected difficulty
  const questions = useMemo(() => {
    return PUZZLE_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleDifficultyChange = (diff: Difficulty) => {
    sound.playPop();
    speech.stop();
    setSelectedDifficulty(diff);
    setCurrentIndex(0);
    resetState();
  };

  const resetState = () => {
    setSelectedChoice(null);
    setHasChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleReadAloud = () => {
    sound.playPop();
    setIsSpeaking(true);
    const content = `${currentQ.prompt}. ${currentQ.subprompt || ''}`;
    speech.speak(content, () => setIsSpeaking(false));
  };

  const handleCheckAnswer = () => {
    speech.stop();
    if (!selectedChoice) return;

    const correct =
      selectedChoice.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      recordAnswer(currentQ.id, 'puzzles', true, currentQ.rewardStars, currentQ.prompt);
      triggerConfetti();
    } else {
      recordAnswer(currentQ.id, 'puzzles', false, currentQ.rewardStars, currentQ.prompt);
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
    resetState();
  };

  const isCompletedAlready = progress.completedQuestionIds.includes(currentQ?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Tab Switcher: Riddles & Quests VS Animal Memory Pairs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            sound.playPop();
            speech.stop();
            setActiveTab('riddles');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base border-b-3 transition-all ${
            activeTab === 'riddles'
              ? 'bg-emerald-600 text-white border-emerald-800 shadow-md'
              : 'bg-white text-emerald-950 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Riddles & Treasure Quest</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            speech.stop();
            setActiveTab('memory');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base border-b-3 transition-all ${
            activeTab === 'memory'
              ? 'bg-emerald-600 text-white border-emerald-800 shadow-md'
              : 'bg-white text-emerald-950 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span>Animal Pairs Challenge</span>
        </button>
      </div>

      {activeTab === 'memory' ? (
        /* Memory Pair Matching Game */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-emerald-300 space-y-6 text-center"
        >
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <span className="text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Woodland Memory Match
            </span>
            <div className="flex items-center gap-1 text-sm font-bold text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>3 Stars Reward</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Find all 6 Animal Pairs!
            </h2>
            <p className="text-emerald-900 font-bold text-sm sm:text-base">
              Tap cards to flip them over and match pairs of woodland friends.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped}
                className={`h-24 sm:h-28 rounded-2xl text-4xl flex items-center justify-center font-black transition-all border-b-4 shadow-sm active:scale-95 ${
                  card.isMatched
                    ? 'bg-emerald-100 border-emerald-400 opacity-90'
                    : card.isFlipped
                    ? 'bg-amber-100 border-amber-400'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-800 text-white hover:brightness-105'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <span>{card.emoji}</span>
                ) : (
                  <span className="text-2xl opacity-70">🌿</span>
                )}
              </button>
            ))}
          </div>

          {memoryWon ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-black text-2xl font-['Fredoka',sans-serif]">
                <Sparkles className="w-7 h-7 text-emerald-500 animate-spin" />
                <span>Hooray! You matched all pairs! ⭐⭐⭐</span>
              </div>
              <p className="text-emerald-900 font-bold text-base">
                Your brain memory power is off the charts!
              </p>
              <button
                onClick={restartMemoryGame}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl border-b-3 border-emerald-800 shadow-md active:translate-y-0.5"
              >
                Play Again! 🔄
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between max-w-lg mx-auto pt-2">
              <span className="text-sm font-black text-slate-600">
                Pairs Matched: {memoryMatchesCount} / {MEMORY_ITEMS.length}
              </span>
              <button
                onClick={restartMemoryGame}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Restart Game
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        /* Standard Riddle, Shapes & Treasure Hunt Section */
        <>
          {/* Difficulty Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl shadow-sm border-2 border-emerald-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {(['explorer', 'adventurer', 'champion'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm capitalize transition-all border-b-2 ${
                    selectedDifficulty === diff
                      ? 'bg-emerald-600 text-white border-emerald-800 shadow-sm'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {diff === 'explorer' && '🌱 Level 1: Explorer'}
                  {diff === 'adventurer' && '⚡ Level 2: Adventurer'}
                  {diff === 'champion' && '👑 Level 3: Champion'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-full">
                Puzzle {currentIndex + 1} of {questions.length}
              </span>
              {isCompletedAlready && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Solved
                </span>
              )}
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-emerald-300 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase">
                  {currentQ.subcategory}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  {currentQ.rewardStars} Star{currentQ.rewardStars > 1 ? 's' : ''}
                </span>
              </div>

              <button
                onClick={handleReadAloud}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all ${
                  isSpeaking
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                }`}
                title="Read puzzle out loud"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Reading...' : 'Read to me 🔊'}</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
                {currentQ.prompt}
              </h2>
              {currentQ.subprompt && (
                <p className="text-base sm:text-lg font-bold text-emerald-900/80">
                  {currentQ.subprompt}
                </p>
              )}
            </div>

            {/* Multiple Choice / Options */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-600">
                {currentQ.type === 'odd_one_out'
                  ? 'Tap the one that does NOT belong:'
                  : 'Select your answer:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((opt) => {
                  const isSelected = selectedChoice === opt;
                  let btnStyle = 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-300';

                  if (hasChecked) {
                    if (opt === String(currentQ.correctAnswer)) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 font-black';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-emerald-200 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400';
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
                      className={`py-3.5 px-4 rounded-2xl text-base sm:text-lg font-bold border-2 text-center transition-all shadow-xs ${btnStyle} active:scale-98`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Explanation */}
            <AnimatePresence>
              {hasChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border-2 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-emerald-50/60 border-amber-300 text-slate-900'
                  } space-y-2`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                        <span className="font-['Fredoka',sans-serif] font-black text-xl text-emerald-700">
                          Puzzle Cracked, Smaya! Outstanding! ⭐
                        </span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-6 h-6 text-amber-600" />
                        <span className="font-['Fredoka',sans-serif] font-black text-xl text-amber-800">
                          Clever thinking! Let&apos;s see the riddle secret:
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-base font-bold leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint Box */}
            {showHint && !hasChecked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl flex items-start gap-3 text-teal-950"
              >
                <Lightbulb className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Hazel Hedgehog&apos;s Clue:</p>
                  <p className="text-sm font-semibold">{currentQ.hint}</p>
                </div>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-100">
              <div>
                {!hasChecked && currentQ.hint && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      setShowHint((prev) => !prev);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold text-sm rounded-xl transition-all"
                  >
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    <span>{showHint ? 'Hide Clue' : 'Need a Clue? 💡'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!hasChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedChoice}
                    className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    Check Answer! ✨
                  </button>
                ) : !isCorrect ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playPop();
                        resetState();
                      }}
                      className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl shadow-md border-b-3 border-amber-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-base rounded-2xl border-b-3 border-slate-400 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      <span>Skip to Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all animate-bounce"
                  >
                    <span>Next Puzzle!</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
