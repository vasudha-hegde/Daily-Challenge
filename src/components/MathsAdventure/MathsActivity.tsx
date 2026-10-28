import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, HelpCircle, Star, Sparkles, Delete } from 'lucide-react';
import { Question, Difficulty } from '../../types';
import { MATHS_QUESTIONS } from '../../data/mathsQuestions';
import { generateMathsQuestion } from '../../utils/mathGenerator';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';
import { speech } from '../../utils/speech';

export const MathsActivity: React.FC = () => {
  const { recordAnswer, progress, triggerConfetti } = useProgress();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('explorer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);
  const [numericValue, setNumericValue] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter curated questions for the selected difficulty
  const curatedQuestions = useMemo(() => {
    return MATHS_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentQ = generatedQuestion || curatedQuestions[currentIndex] || curatedQuestions[0];

  const handleDifficultyChange = (diff: Difficulty) => {
    sound.playPop();
    speech.stop();
    setSelectedDifficulty(diff);
    setCurrentIndex(0);
    resetState();
  };

  const resetState = () => {
    setNumericValue('');
    setSelectedChoice(null);
    setHasChecked(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleReadAloud = () => {
    sound.playPop();
    setIsSpeaking(true);
    const textToSpeak = `${currentQ.prompt}. ${currentQ.subprompt || ''}`;
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

  const handleGenerateRandom = () => {
    sound.playPop();
    speech.stop();
    const newQ = generateMathsQuestion(selectedDifficulty);
    setGeneratedQuestion(newQ);
    resetState();
  };

  const handleCheckAnswer = () => {
    speech.stop();
    let correct = false;

    if (currentQ.type === 'multiple_choice') {
      if (!selectedChoice) return;
      correct = selectedChoice.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    } else {
      // numeric input
      if (!numericValue) return;
      correct = parseInt(numericValue, 10) === Number(currentQ.correctAnswer);
    }

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      recordAnswer(currentQ.id, 'maths', true, currentQ.rewardStars, currentQ.prompt);
      triggerConfetti();
    } else {
      recordAnswer(currentQ.id, 'maths', false, currentQ.rewardStars, currentQ.prompt);
    }
  };

  const handleNext = () => {
    sound.playPop();
    speech.stop();
    if (generatedQuestion) {
      setGeneratedQuestion(generateMathsQuestion(selectedDifficulty));
    } else if (currentIndex < curatedQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGeneratedQuestion(generateMathsQuestion(selectedDifficulty));
    }
    resetState();
  };

  const isCompletedAlready = progress.completedQuestionIds.includes(currentQ?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar: Difficulty Tabs & Question Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl shadow-sm border-2 border-amber-200">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {(['explorer', 'adventurer', 'champion'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm capitalize transition-all border-b-2 ${
                selectedDifficulty === diff
                  ? 'bg-amber-500 text-white border-amber-700 shadow-sm'
                  : 'bg-amber-100/70 text-amber-900 border-amber-200 hover:bg-amber-200'
              }`}
            >
              {diff === 'explorer' && '🌱 Level 1: Explorer'}
              {diff === 'adventurer' && '⚡ Level 2: Adventurer'}
              {diff === 'champion' && '👑 Level 3: Champion'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateRandom}
            className="flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-full border border-amber-300 shadow-xs transition-all active:scale-95"
            title="Generate a brand new randomised maths question"
          >
            <span>🎲 New Random Question</span>
          </button>
          <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full">
            {generatedQuestion ? 'Infinite Practice' : `Question ${currentIndex + 1} of ${curatedQuestions.length}`}
          </span>
          {isCompletedAlready && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-amber-300 space-y-6"
      >
        {/* Header with Read Aloud & Subcategory */}
        <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full uppercase">
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
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
            title="Read question out loud in British English"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Read to me 🔊'}</span>
          </button>
        </div>

        {/* Prompt */}
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
            {currentQ.prompt}
          </h2>
          {currentQ.subprompt && (
            <p className="text-base sm:text-lg font-bold text-amber-900/80">
              {currentQ.subprompt}
            </p>
          )}
        </div>

        {/* Visuals / Interactive Counters */}
        {currentQ.visuals && currentQ.visuals.length > 0 && (
          <div className="p-4 sm:p-6 bg-amber-50/70 rounded-2xl border-2 border-dashed border-amber-300">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 text-center">
              Counting Helper: Tap or count the friendly objects below!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {currentQ.visuals.map((vis, vIdx) => (
                <div
                  key={vIdx}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-amber-200 text-center"
                >
                  <div className="flex flex-wrap max-w-xs justify-center gap-1.5 mb-1.5">
                    {Array.from({ length: vis.count }).map((_, i) => (
                      <span
                        key={i}
                        className="text-2xl sm:text-3xl drop-shadow-xs hover:scale-125 transition-transform cursor-pointer select-none"
                        title="Count me!"
                        onClick={() => sound.playPop()}
                      >
                        {vis.emoji}
                      </span>
                    ))}
                  </div>
                  {vis.label && (
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {vis.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Section */}
        {currentQ.type === 'multiple_choice' ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-600">Choose the correct answer:</p>
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
                    className={`py-3.5 px-4 rounded-2xl text-lg sm:text-xl font-bold border-2 text-center transition-all shadow-xs ${btnStyle} active:scale-98`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Numeric Input Section with child-friendly on-screen Number Pad */
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <label htmlFor="math-answer-display" className="text-sm font-bold text-slate-600">Your answer:</label>
              <div
                id="math-answer-display"
                tabIndex={0}
                aria-label="Your math answer"
                className={`min-w-[140px] px-6 py-3 rounded-2xl border-4 text-3xl sm:text-4xl font-black text-center shadow-inner tracking-widest ${
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

            {/* Child-friendly On-Screen Number Pad (0-9, Backspace, Clear) */}
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumericPad(digit)}
                  disabled={hasChecked && isCorrect}
                  className="py-3 bg-slate-100 hover:bg-amber-100 text-slate-800 font-black text-xl sm:text-2xl rounded-2xl border-b-3 border-slate-300 active:border-b-0 active:translate-y-1 shadow-xs transition-all"
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
                className="py-3 bg-slate-100 hover:bg-amber-100 text-slate-800 font-black text-xl sm:text-2xl rounded-2xl border-b-3 border-slate-300 active:border-b-0 active:translate-y-1 shadow-xs transition-all"
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
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              } space-y-2`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-emerald-700">
                      Fantastic work, Smaya! That is spot on! ⭐
                    </span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-amber-800">
                      Good try! Let&apos;s see how to solve it together:
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

        {/* Hint Box (if toggled) */}
        {showHint && !hasChecked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-sky-50 border-2 border-sky-300 rounded-2xl flex items-start gap-3 text-sky-950"
          >
            <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Barnaby Owl&apos;s Friendly Hint:</p>
              <p className="text-sm font-semibold">{currentQ.hint}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom Actions: Check / Retry / Next / Hint */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-100">
          <div>
            {!hasChecked && currentQ.hint && (
              <button
                onClick={() => {
                  sound.playPop();
                  setShowHint((prev) => !prev);
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
                  currentQ.type === 'multiple_choice' ? !selectedChoice : !numericValue
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
                <span>Next Adventure!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
