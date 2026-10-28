import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, Star, Calendar, CheckCircle2, Flame } from 'lucide-react';
import { Category } from '../types';
import { useProgress } from '../context/ProgressContext';
import { sound } from '../utils/sound';

interface HomeScreenProps {
  onSelectCategory: (cat: Category) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCategory }) => {
  const { progress, currentRank } = useProgress();
  const daily = progress.dailyChallenge;

  const handleSelect = (cat: Category) => {
    sound.playPop();
    onSelectCategory(cat);
  };

  const cards = [
    {
      id: 'maths' as Category,
      title: 'Maths Adventures',
      badgeText: 'Numbers & Shapes',
      description: 'Addition, subtraction, times tables, division & fun word problems!',
      icon: '🧮',
      animal: '🦉 Barnaby Owl',
      starsCount: progress.mathsStars,
      bgGradient: 'from-amber-400 via-orange-400 to-amber-500',
      shadowColor: 'border-amber-600',
      pillBg: 'bg-amber-100 text-amber-900',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-800',
    },
    {
      id: 'words' as Category,
      title: 'Word Wizard',
      badgeText: 'Spelling & Stories',
      description: 'Spelling games, missing letters, word scramble & reading stories!',
      icon: '🧙‍♂️',
      animal: '🐿️ Pip the Squirrel',
      starsCount: progress.wordStars,
      bgGradient: 'from-sky-400 via-blue-500 to-indigo-500',
      shadowColor: 'border-blue-700',
      pillBg: 'bg-blue-100 text-blue-900',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-800',
    },
    {
      id: 'puzzles' as Category,
      title: 'Puzzle Island',
      badgeText: 'Riddles & Logic',
      description: 'Logic riddles, odd-one-out, 2D/3D shapes, memory & treasure hunt!',
      icon: '🏝️',
      animal: '🦔 Hazel Hedgehog',
      starsCount: progress.puzzleStars,
      bgGradient: 'from-emerald-400 via-teal-500 to-green-600',
      shadowColor: 'border-emerald-700',
      pillBg: 'bg-emerald-100 text-emerald-900',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800',
    },
    {
      id: 'knowledge' as Category,
      title: 'General Knowledge',
      badgeText: 'Discover & Explore',
      description: 'Discover something new every day! Science, space, nature, history & the world!',
      icon: '🌍',
      animal: '🦊 Oliver the Fox',
      starsCount: progress.knowledgeStars || 0,
      bgGradient: 'from-teal-400 via-cyan-500 to-blue-600',
      shadowColor: 'border-teal-700',
      pillBg: 'bg-teal-100 text-teal-900',
      buttonBg: 'bg-teal-600 hover:bg-teal-700 text-white border-teal-800',
    },
    {
      id: 'stars' as Category,
      title: 'My Stars & Rewards',
      badgeText: 'Chests & Badges',
      description: 'Open magic treasure chests, check your badges and track your rank!',
      icon: '🎁',
      animal: '👑 Quest Champion',
      starsCount: progress.totalStars,
      bgGradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
      shadowColor: 'border-purple-700',
      pillBg: 'bg-purple-100 text-purple-900',
      buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-800',
    },
  ];

  const isDailyDone = Boolean(daily?.isCompleted);
  const dailyDoneCount = daily?.completedIndices.length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-200 rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-lg text-center relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/30 rounded-full text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Welcome back, Smaya! Year 2 & 3 Champion</span>
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-['Fredoka',sans-serif] tracking-tight">
            Ready for Today&apos;s Quest?
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-bold max-w-xl mx-auto">
            Choose an activity below to earn shining stars, crack secret codes, and unlock magical treasure chests!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full shadow-xs border border-amber-300 text-sm font-bold text-amber-900">
              <span className="text-lg">⭐</span>
              <span>{progress.totalStars} Stars in your Bank</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full shadow-xs border border-amber-300 text-sm font-bold text-amber-900">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{currentRank.title}</span>
            </div>
            {progress.dailyChallengesCompletedCount > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full shadow-xs border border-amber-300 text-sm font-bold text-emerald-800">
                <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{progress.dailyChallengesCompletedCount} Daily Quests Won</span>
              </div>
            )}
          </div>
        </div>

        {/* Playful background decorative clouds */}
        <span className="absolute -top-6 -left-6 text-7xl opacity-20 pointer-events-none select-none">
          ☁️
        </span>
        <span className="absolute -bottom-6 -right-6 text-7xl opacity-20 pointer-events-none select-none">
          🌈
        </span>
      </motion.div>

      {/* Prominent Daily Challenge Card */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => handleSelect('daily')}
        className={`cursor-pointer rounded-3xl p-5 sm:p-6 text-white shadow-xl border-b-6 transition-all relative overflow-hidden ${
          isDailyDone
            ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 border-emerald-800'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-purple-900'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-white/30 shrink-0">
              {isDailyDone ? '🏆' : '🗓️'}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                  Today&apos;s Special Quest
                </span>
                <span className="text-xs font-bold text-white/80">
                  {daily?.date}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] text-white">
                {isDailyDone ? 'Daily Challenge Complete!' : `Today's ${daily?.questions?.length || 30}-Question Daily Challenge`}
              </h3>
              <p className="text-white/90 text-sm sm:text-base font-bold mt-0.5">
                {isDailyDone
                  ? `You scored ${daily?.score}/${daily?.questions?.length || 30} and earned bonus stars! Tap to review or practice.`
                  : dailyDoneCount > 0
                  ? `In progress: ${dailyDoneCount} of ${daily?.questions?.length || 30} questions completed. Continue right where you left off!`
                  : 'A balanced mix of Maths, Spelling, Puzzle Island and General Knowledge questions ready for today!'}
              </p>
            </div>
          </div>

          <button
            tabIndex={-1}
            className={`px-6 py-3.5 rounded-2xl font-black text-base shadow-lg border-b-4 shrink-0 transition-all ${
              isDailyDone
                ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 border-emerald-600'
                : 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-600 animate-bounce'
            }`}
          >
            {isDailyDone ? 'View Results 🏆' : dailyDoneCount > 0 ? 'Resume Quest 🚀' : "Start Today's Quest! ⭐"}
          </button>
        </div>

        {/* Decorative background watermark */}
        <span className="absolute -bottom-8 -right-8 text-8xl opacity-10 pointer-events-none select-none">
          ⭐
        </span>
      </motion.div>

      {/* Five Large Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(card.id)}
            className={`cursor-pointer rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${card.bgGradient} text-white shadow-xl border-b-6 ${card.shadowColor} relative overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[240px] group transition-all`}
          >
            {/* Top row: badge & stars */}
            <div className="flex items-center justify-between gap-2 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${card.pillBg}`}>
                {card.badgeText}
              </span>

              <div className="flex items-center gap-1 px-3 py-1 bg-black/20 backdrop-blur-xs rounded-full text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                <span>{card.starsCount} {card.id === 'stars' ? 'Total' : 'Earned'}</span>
              </div>
            </div>

            {/* Middle: Title & Mascot */}
            <div className="my-3 z-10 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl drop-shadow select-none group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] tracking-wide text-white drop-shadow-sm">
                  {card.title}
                </h3>
              </div>

              <p className="text-white/90 font-bold text-sm sm:text-base leading-snug pt-1">
                {card.description}
              </p>
            </div>

            {/* Bottom: Play button with 3D press feel */}
            <div className="flex items-center justify-between pt-2 z-10 border-t border-white/20">
              <span className="text-xs sm:text-sm font-extrabold text-white/90">
                With {card.animal}
              </span>

              <button
                tabIndex={-1}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm shadow-md border-b-3 ${card.buttonBg} transition-transform group-hover:translate-x-1`}
              >
                <span>Let&apos;s Play</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle decorative background watermarks */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
