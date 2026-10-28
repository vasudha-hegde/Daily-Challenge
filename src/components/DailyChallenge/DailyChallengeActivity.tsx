import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, HelpCircle, Star, Sparkles, Delete, X, Trophy, RefreshCw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { Category } from '../../types';
import { validateSentenceAnswer } from '../../utils/sentenceUtils';

interface DailyChallengeActivityProps {
  onChooseExtraPractice: (category: Category) => void;
}

export const DailyChallengeActivity: React.FC<DailyChallengeActivityProps> = ({ onChooseExtraPractice }) => {
  const {
    progress,
    recordDailyChallengeAnswer,
    recordDailyChallengeHintUsed,
    setDailyChallengeCurrentIndex,
    triggerConfetti,
  } = useProgress();
  const daily = progress.dailyChallenge;

  // Initial index resolved safely from daily challenge state
  const questionsCount = daily?.questions?.length || 10;
  const initialIndex =
    daily && typeof daily.currentIndex === 'number' && daily.currentIndex >= 0 && daily.currentIndex < questionsCount
      ? daily.currentIndex
      : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  // User input states
  const [numericValue, setNumericValue] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [scramblePlacedLetters, setScramblePlacedLetters] = useState<string[]>([]);
  const [sentencePlacedWords, setSentencePlacedWords] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Synchronize currentIndex if daily.currentIndex changes from storage restore or external resume
  useEffect(() => {
    if (
      daily &&
      typeof daily.currentIndex === 'number' &&
      daily.currentIndex >= 0 &&
      daily.currentIndex < questionsCount &&
      daily.currentIndex !== currentIndex
    ) {
      setCurrentIndex(daily.currentIndex);
    }
  }, [daily?.currentIndex, questionsCount]);

  const currentQ = daily?.questions?.[currentIndex] || daily?.questions?.[0];

  // Sync inputs whenever currentIndex changes or if question was previously answered
  useEffect(() => {
    if (!daily || !currentQ) return;
    const submitted = daily.submittedAnswers?.[currentIndex];
    const hintRecorded = Boolean(daily.hintsUsed?.[currentIndex]);
    setShowHint(hintRecorded);

    if (submitted) {
      setHasChecked(true);
      setIsCorrect(submitted.isCorrect);
      if (currentQ.type === 'multiple_choice') {
        setSelectedChoice(String(submitted.userAnswer));
      } else if (currentQ.type === 'numeric_input') {
        setNumericValue(String(submitted.userAnswer));
      } else if (currentQ.type === 'word_unscramble') {
        setScramblePlacedLetters(String(submitted.userAnswer).split(''));
      } else if (currentQ.type === 'sentence_builder') {
        setSentencePlacedWords(
          Array.isArray(submitted.userAnswer) ? (submitted.userAnswer as string[]) : [String(submitted.userAnswer)]
        );
      }
    } else {
      setNumericValue('');
      setSelectedChoice(null);
      setScramblePlacedLetters([]);
      setSentencePlacedWords([]);
      setHasChecked(false);
      setIsCorrect(false);
    }
  }, [currentIndex, daily?.submittedAnswers, currentQ?.type, currentQ?.id]);

  if (!daily || !daily.questions || daily.questions.length === 0 || !currentQ) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p className="font-bold text-slate-700">Loading today&apos;s Daily Quest...</p>
      </div>
    );
  }

  const resetInputState = () => {
    setNumericValue('');
    setSelectedChoice(null);
    setScramblePlacedLetters([]);
    setSentencePlacedWords([]);
    setHasChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleReadAloud = (customText?: string) => {
    sound.playPop();
    setIsSpeaking(true);
    const textToSpeak =
      customText ||
      `${currentQ.prompt}. ${currentQ.subprompt || ''} ${currentQ.storyPassage ? `Story: ${currentQ.storyPassage}` : ''}`;
    speech.speak(textToSpeak, () => setIsSpeaking(false));
  };

  const handleNumericPad = (num: string) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    if (numericValue.length < 4) {
      setNumericValue((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    sound.playPop();
    setNumericValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playPop();
    setNumericValue('');
  };

  const handleScrambleTile = (letter: string) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setScramblePlacedLetters((prev) => [...prev, letter]);
  };

  const handleRemovePlacedLetter = (idx: number) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setScramblePlacedLetters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSentenceWord = (word: string) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setSentencePlacedWords((prev) => [...prev, word]);
  };

  const handleRemovePlacedWord = (idx: number) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setSentencePlacedWords((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCheckAnswer = () => {
    speech.stop();
    let correct = false;
    let userAnswer: string | number | string[] = '';

    if (currentQ.type === 'word_unscramble') {
      userAnswer = scramblePlacedLetters.join('').toUpperCase();
      correct = userAnswer === String(currentQ.correctAnswer).toUpperCase();
    } else if (currentQ.type === 'sentence_builder') {
      userAnswer = sentencePlacedWords;
      const expectedArray = Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer : [currentQ.correctAnswer];
      const alternativeOrders = Array.isArray(currentQ.alternativeAnswers)
        ? (currentQ.alternativeAnswers as string[][])
        : undefined;
      correct = validateSentenceAnswer(sentencePlacedWords, expectedArray, alternativeOrders);
    } else if (currentQ.type === 'numeric_input') {
      if (!numericValue) return;
      userAnswer = parseInt(numericValue, 10);
      correct = userAnswer === Number(currentQ.correctAnswer);
    } else {
      if (!selectedChoice) return;
      userAnswer = selectedChoice;
      correct = selectedChoice.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    }

    setIsCorrect(correct);
    setHasChecked(true);

    const hintUsed = showHint || Boolean(daily?.hintsUsed?.[currentIndex]);
    recordDailyChallengeAnswer(currentIndex, correct, currentQ.rewardStars, userAnswer, currentQ.prompt, hintUsed);

    if (correct) {
      triggerConfetti();
    }
  };

  const goToQuestion = (idx: number) => {
    sound.playPop();
    speech.stop();
    setCurrentIndex(idx);
    setDailyChallengeCurrentIndex(idx);
  };

  const handleNext = () => {
    if (currentIndex < daily.questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  // If daily challenge already completed and not in review mode
  if (daily.isCompleted && !isReviewing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-8 border-4 border-amber-300 shadow-2xl space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <span className="px-4 py-1.5 bg-amber-200/80 text-amber-950 font-black text-xs uppercase tracking-widest rounded-full">
              Daily Quest Completed!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 font-['Fredoka',sans-serif]">
              Spectacular Job, Smaya!
            </h2>
            <p className="text-base sm:text-lg font-bold text-amber-900 max-w-lg mx-auto">
              You completed all {daily.questions.length} questions of today&apos;s Daily Challenge! A fresh challenge will unlock tomorrow.
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
              <p className="text-xs font-black uppercase text-amber-800">Today&apos;s Score</p>
              <p className="text-3xl font-black text-amber-600">{daily.score} / {daily.questions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
              <p className="text-xs font-black uppercase text-amber-800">Bonus Stars Awarded</p>
              <p className="text-3xl font-black text-amber-600">+5 ⭐</p>
            </div>
          </div>

          {/* Option to review questions */}
          <div>
            <button
              onClick={() => {
                setIsReviewing(true);
                goToQuestion(0);
              }}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 cursor-pointer"
            >
              Review Today&apos;s Questions 📋
            </button>
          </div>

          {/* Choose subject for extra practice */}
          <div className="pt-4 border-t border-amber-200 space-y-3">
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Fancy Extra Practice? Choose a Subject:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => onChooseExtraPractice('maths')}
                className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-md border-b-3 border-amber-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                🧮 Maths Adventures
              </button>
              <button
                onClick={() => onChooseExtraPractice('words')}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md border-b-3 border-blue-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                🧙‍♂️ Word Wizard
              </button>
              <button
                onClick={() => onChooseExtraPractice('puzzles')}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md border-b-3 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                🏝️ Puzzle Island
              </button>
              <button
                onClick={() => onChooseExtraPractice('knowledge')}
                className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-md border-b-3 border-teal-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                🌍 General Knowledge
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCompletedThisQ = daily.completedIndices.includes(currentIndex);

  const categoryColor =
    currentQ.category === 'maths'
      ? 'border-amber-400 bg-amber-50'
      : currentQ.category === 'words'
      ? 'border-blue-400 bg-blue-50'
      : currentQ.category === 'knowledge'
      ? 'border-teal-400 bg-teal-50'
      : 'border-emerald-400 bg-emerald-50';

  const categoryLabel =
    currentQ.category === 'maths'
      ? '🧮 Maths Adventure'
      : currentQ.category === 'words'
      ? '🧙‍♂️ Word Wizard'
      : currentQ.category === 'knowledge'
      ? '🌍 General Knowledge'
      : '🏝️ Puzzle Island';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Daily Quest Progress Bar with Clickable Steps */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
              Daily Challenge • Question {currentIndex + 1} of {daily.questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isReviewing && (
              <button
                onClick={() => setIsReviewing(false)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                Back to Results 🏆
              </button>
            )}
            {isCompletedThisQ && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </span>
            )}
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* 20 Step Interactive Progress Tracker Bar (renders 2 rows of 10 for 20 questions) */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 pt-1">
          {daily.questions.map((_, idx) => {
            const isDone = daily.completedIndices.includes(idx);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`h-3.5 rounded-full transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500 hover:brightness-110'
                    : isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-500 animate-pulse'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Jump to Question ${idx + 1}`}
                aria-label={`Question ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 ${categoryColor} space-y-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-black rounded-full uppercase">
              {currentQ.subcategory}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              {currentQ.rewardStars} Star{currentQ.rewardStars > 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={() => handleReadAloud()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
            title="Read question out loud in British English"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Read to me 🔊'}</span>
          </button>
        </div>

        {/* Story passage if comprehension */}
        {currentQ.storyPassage && (
          <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 text-slate-800 text-base font-bold leading-relaxed">
            &ldquo;{currentQ.storyPassage}&rdquo;
          </div>
        )}

        {/* Prompt */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
            {currentQ.prompt}
          </h2>
          {currentQ.subprompt && (
            <p className="text-base sm:text-lg font-bold text-slate-600">
              {currentQ.subprompt}
            </p>
          )}
        </div>

        {/* Visuals for Maths visual counting */}
        {currentQ.visuals && currentQ.visuals.length > 0 && (
          <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-dashed border-amber-300 text-center">
            <p className="text-xs font-bold text-amber-800 uppercase mb-2">Count the friendly objects:</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {currentQ.visuals.map((vis, vIdx) => (
                <div key={vIdx} className="bg-white p-3 rounded-2xl shadow-xs border border-amber-200">
                  <div className="flex flex-wrap max-w-xs justify-center gap-1 mb-1">
                    {Array.from({ length: vis.count }).map((_, i) => (
                      <span
                        key={i}
                        className="text-2xl hover:scale-125 transition-transform cursor-pointer select-none"
                        onClick={() => sound.playPop()}
                      >
                        {vis.emoji}
                      </span>
                    ))}
                  </div>
                  {vis.label && (
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {vis.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Input Formats */}
        {currentQ.type === 'numeric_input' ? (
          /* Numeric keypad */
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold text-slate-600">Your answer:</span>
              <div
                className={`min-w-[140px] px-6 py-3 rounded-2xl border-4 text-3xl font-black text-center shadow-inner tracking-widest ${
                  hasChecked
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-rose-100 border-rose-400 text-rose-900'
                    : 'bg-amber-50 border-amber-400 text-amber-950'
                }`}
              >
                {numericValue || <span className="text-slate-300">?</span>}
              </div>
            </div>

            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumericPad(digit)}
                  disabled={hasChecked && isCorrect}
                  className="py-3 bg-slate-100 hover:bg-amber-100 text-slate-800 font-black text-xl rounded-2xl border-b-3 border-slate-300 active:border-b-0 active:translate-y-1 shadow-xs transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                disabled={hasChecked && isCorrect}
                className="py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase rounded-2xl border-b-3 border-slate-300 active:border-b-0 active:translate-y-1"
              >
                Clear
              </button>
              <button
                onClick={() => handleNumericPad('0')}
                disabled={hasChecked && isCorrect}
                className="py-3 bg-slate-100 hover:bg-amber-100 text-slate-800 font-black text-xl rounded-2xl border-b-3 border-slate-300 active:border-b-0 active:translate-y-1 shadow-xs transition-all"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                disabled={hasChecked && isCorrect}
                className="py-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-2xl border-b-3 border-rose-300 active:border-b-0 active:translate-y-1 flex items-center justify-center"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : currentQ.type === 'word_unscramble' ? (
          /* Scramble builder */
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-600">Word built:</p>
                {scramblePlacedLetters.length > 0 && !hasChecked && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      setScramblePlacedLetters([]);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded-lg"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-blue-50 border-3 border-dashed border-blue-300 rounded-2xl items-center justify-center">
                {scramblePlacedLetters.length === 0 ? (
                  <span className="text-sm font-bold text-blue-400">Tap letter tiles below!</span>
                ) : (
                  scramblePlacedLetters.map((l, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemovePlacedLetter(i)}
                      disabled={hasChecked && isCorrect}
                      className="w-12 h-14 bg-white border-b-3 border-blue-500 rounded-xl font-black text-2xl text-blue-900 shadow-sm flex items-center justify-center hover:bg-rose-50 hover:border-rose-400 cursor-pointer"
                    >
                      {l}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {currentQ.options?.map((letter, idx) => {
                const timesPlaced = scramblePlacedLetters.filter((l) => l === letter).length;
                const totalInOptions = currentQ.options?.filter((l) => l === letter).length || 1;
                const isAvail = timesPlaced < totalInOptions;

                return (
                  <button
                    key={idx}
                    onClick={() => handleScrambleTile(letter)}
                    disabled={!isAvail || (hasChecked && isCorrect)}
                    className={`w-12 h-14 font-black text-2xl rounded-xl border-b-3 ${
                      isAvail
                        ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-700 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border-slate-300 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        ) : currentQ.type === 'sentence_builder' ? (
          /* Sentence builder */
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-600">Your sentence:</p>
                {sentencePlacedWords.length > 0 && !hasChecked && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      setSentencePlacedWords([]);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded-lg"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-blue-50 border-3 border-dashed border-blue-300 rounded-2xl items-center">
                {sentencePlacedWords.length === 0 ? (
                  <span className="text-sm font-bold text-blue-400">Tap word chips in order!</span>
                ) : (
                  sentencePlacedWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemovePlacedWord(idx)}
                      disabled={hasChecked && isCorrect}
                      className="px-3.5 py-1.5 bg-white border-b-3 border-blue-500 rounded-xl font-bold text-base text-blue-950 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>{word}</span>
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {currentQ.options?.map((word, idx) => {
                const timesPlaced = sentencePlacedWords.filter((w) => w === word).length;
                const totalInOptions = currentQ.options?.filter((w) => w === word).length || 1;
                const isAvail = timesPlaced < totalInOptions;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSentenceWord(word)}
                    disabled={!isAvail || (hasChecked && isCorrect)}
                    className={`px-4 py-2 rounded-xl font-bold text-base border-b-3 ${
                      isAvail
                        ? 'bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700'
                        : 'bg-slate-200 text-slate-400 border-slate-300 opacity-40'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard multiple choice */
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-600">Select your answer:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedChoice === opt;
                let btnStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-300';

                if (hasChecked) {
                  if (opt === String(currentQ.correctAnswer)) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 font-black';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-amber-200 border-amber-500 text-amber-950 font-black ring-2 ring-amber-400';
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
        )}

        {/* Feedback & Explanation */}
        <AnimatePresence>
          {hasChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border-2 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
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
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-amber-800">
                      Good try! Here is how to work it out:
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
            className="p-4 bg-sky-50 border-2 border-sky-300 rounded-2xl flex items-start gap-3 text-sky-950"
          >
            <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Friendly Hint:</p>
              <p className="text-sm font-semibold">{currentQ.hint}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom Actions with Previous & Next navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            {!hasChecked && currentQ.hint && (
              <button
                onClick={() => {
                  sound.playPop();
                  setShowHint((prev) => {
                    const next = !prev;
                    if (next) {
                      recordDailyChallengeHintUsed(currentIndex);
                    }
                    return next;
                  });
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm rounded-xl transition-all"
              >
                <Lightbulb className="w-4 h-4 text-sky-600" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint? 💡'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  currentQ.type === 'numeric_input'
                    ? !numericValue
                    : currentQ.type === 'word_unscramble'
                    ? scramblePlacedLetters.length === 0
                    : currentQ.type === 'sentence_builder'
                    ? sentencePlacedWords.length === 0
                    : !selectedChoice
                }
                className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all"
              >
                Check Answer! ✨
              </button>
            ) : !isCorrect ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    resetInputState();
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl shadow-md border-b-3 border-amber-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                {currentIndex < daily.questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-base rounded-2xl border-b-3 border-slate-400 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all animate-bounce"
              >
                <span>{currentIndex === daily.questions.length - 1 ? 'Finish Quest! 🏆' : 'Next Question!'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
