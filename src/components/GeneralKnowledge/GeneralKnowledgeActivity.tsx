import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, HelpCircle, Star, Sparkles, Compass } from 'lucide-react';
import { Difficulty } from '../../types';
import { GENERAL_KNOWLEDGE_QUESTIONS } from '../../data/generalKnowledgeQuestions';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';
import { speech } from '../../utils/speech';

const ALL_TOPICS = [
  'All Topics',
  'Science & Nature',
  'Space & Planets',
  'Animals & Habitats',
  'Geography & Landmarks',
  'History & Inventions',
  'Human Body & Health',
  'Weather & Environment',
  'Technology & Life',
  'Arts & Culture',
  'Sport & World Facts',
];

export const GeneralKnowledgeActivity: React.FC = () => {
  const { recordAnswer, progress, triggerConfetti } = useProgress();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('explorer');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter curated questions for difficulty & topic
  const filteredQuestions = useMemo(() => {
    return GENERAL_KNOWLEDGE_QUESTIONS.filter((q) => {
      const matchDiff = q.difficulty === selectedDifficulty;
      const matchTopic = selectedTopic === 'All Topics' || q.subcategory === selectedTopic;
      return matchDiff && matchTopic;
    });
  }, [selectedDifficulty, selectedTopic]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0] || GENERAL_KNOWLEDGE_QUESTIONS[0];

  const handleDifficultyChange = (diff: Difficulty) => {
    sound.playPop();
    speech.stop();
    setSelectedDifficulty(diff);
    setCurrentIndex(0);
    resetState();
  };

  const handleTopicChange = (topic: string) => {
    sound.playPop();
    speech.stop();
    setSelectedTopic(topic);
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
    const textToSpeak = `${currentQ.prompt}. ${currentQ.subprompt || ''}`;
    speech.speak(textToSpeak, () => setIsSpeaking(false));
  };

  const handleChoiceSelect = (choice: string) => {
    if (hasChecked && isCorrect) return;
    sound.playPop();
    setSelectedChoice(choice);
  };

  const handleCheckAnswer = () => {
    if (!selectedChoice) return;
    speech.stop();

    const correct = selectedChoice.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    setIsCorrect(correct);
    setHasChecked(true);

    const isFirstTime = recordAnswer(currentQ.id, 'knowledge', correct, currentQ.rewardStars, currentQ.prompt);
    if (correct && isFirstTime) {
      triggerConfetti();
    }
  };

  const handleNext = () => {
    sound.playPop();
    speech.stop();
    resetState();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      sound.playPop();
      speech.stop();
      resetState();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCompletedAlready = progress.completedQuestionIds.includes(currentQ.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar with Mascot, Difficulty and Subject Description */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 p-5 sm:p-6 rounded-3xl text-white shadow-lg border-b-6 border-teal-800">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <span className="text-4xl sm:text-5xl drop-shadow select-none">🦊</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif]">
                General Knowledge
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
                Year 3 (Age 8-9)
              </span>
            </div>
            <p className="text-teal-100 text-xs sm:text-sm font-bold">
              Discover something new every day with Oliver the Fox!
            </p>
          </div>
        </div>

        {/* 3 Difficulty Tabs */}
        <div className="flex bg-black/20 p-1 rounded-2xl border border-white/20">
          {(['explorer', 'adventurer', 'champion'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs capitalize transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-white text-teal-950 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {diff === 'explorer' ? '🌱 Starter' : diff === 'adventurer' ? '🌿 Explorer' : '👑 Master'}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none px-1">
        <Compass className="w-4 h-4 text-teal-700 shrink-0 ml-1" />
        <span className="text-xs font-black uppercase text-teal-900 shrink-0 mr-1">Topics:</span>
        {ALL_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTopic === topic
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-teal-50 text-slate-700 border border-teal-200'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-teal-400 space-y-6"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs font-black rounded-full uppercase tracking-wider">
              {currentQ.subcategory}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              {currentQ.rewardStars} Star{currentQ.rewardStars > 1 ? 's' : ''}
            </span>
            {isCompletedAlready && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>

          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xs transition-all ${
              isSpeaking
                ? 'bg-teal-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
            title="Read question out loud in British English"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Read to me 🔊'}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif] leading-snug">
            {currentQ.prompt}
          </h3>
          {currentQ.subprompt && (
            <p className="text-base sm:text-lg font-bold text-slate-600">
              {currentQ.subprompt}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-600">Select your answer:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options?.map((opt) => {
              const isSelected = selectedChoice === opt;
              let btnStyle = 'bg-slate-50 hover:bg-teal-50 text-slate-800 border-slate-300';

              if (hasChecked) {
                if (opt === String(currentQ.correctAnswer)) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 font-black';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                }
              } else if (isSelected) {
                btnStyle = 'bg-teal-100 border-teal-500 text-teal-950 font-black ring-2 ring-teal-400';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleChoiceSelect(opt)}
                  disabled={hasChecked && isCorrect}
                  className={`py-3.5 px-4 rounded-2xl text-base sm:text-lg font-bold border-2 text-center transition-all shadow-xs ${btnStyle} active:scale-98 cursor-pointer`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Interesting Fact Explanation */}
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
                      Spot on, Smaya! Brilliant discovery! ⭐
                    </span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    <span className="font-['Fredoka',sans-serif] font-black text-xl text-amber-800">
                      Good try! Here is a fascinating fact:
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
              <p className="font-bold text-sm">Helpful Clue:</p>
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
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            {!hasChecked && currentQ.hint && (
              <button
                onClick={() => {
                  sound.playPop();
                  setShowHint((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-sky-600" />
                <span>{showHint ? 'Hide Clue' : 'Need a Clue? 💡'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedChoice}
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
                  <span>Next Fact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all animate-bounce cursor-pointer"
              >
                <span>Next Question! 🌍</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
