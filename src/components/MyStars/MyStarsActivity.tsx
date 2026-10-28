import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Lock, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { sound } from '../../utils/sound';

export const MyStarsActivity: React.FC = () => {
  const { progress, badges, chests, openChest, currentRank } = useProgress();

  const handleOpenChest = (chestId: string) => {
    sound.playPop();
    openChest(chestId);
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlockedAt).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Top Banner: Rank & Star Treasury */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-purple-400 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Smaya&apos;s Star Treasury</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-5xl sm:text-6xl drop-shadow-md select-none">{currentRank.icon}</span>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka',sans-serif]">
                  {currentRank.title}
                </h2>
                <p className="text-purple-100 text-sm sm:text-base font-bold">
                  {currentRank.nextRankAt < 900
                    ? `${currentRank.nextRankAt - progress.totalStars} more stars to reach the next rank!`
                    : 'You have reached the highest Quest Rank in the land!'}
                </p>
              </div>
            </div>
          </div>

          {/* Huge Star Bank Display */}
          <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border-2 border-white/30 text-center min-w-[200px] shadow-inner">
            <span className="text-5xl drop-shadow-md block mb-1">⭐</span>
            <span className="text-4xl sm:text-5xl font-black font-['Fredoka',sans-serif] tracking-tight">
              {progress.totalStars}
            </span>
            <p className="text-xs font-black uppercase tracking-wider text-purple-100 mt-1">
              Stars Collected
            </p>
          </div>
        </div>

        {/* Decorative background stars */}
        <span className="absolute -top-4 -right-4 text-7xl opacity-20 pointer-events-none select-none">✨</span>
      </motion.div>

      {/* Progress Breakdown Cards (4 categories) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-amber-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0">
            🧮
          </div>
          <div>
            <p className="text-xs font-black uppercase text-amber-800">Maths Stars</p>
            <p className="text-2xl font-black text-amber-950">{progress.mathsStars} ⭐</p>
            <p className="text-xs font-bold text-slate-500">Addition, Times Tables & Sharing</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-blue-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shrink-0">
            🧙‍♂️
          </div>
          <div>
            <p className="text-xs font-black uppercase text-blue-800">Word Stars</p>
            <p className="text-2xl font-black text-blue-950">{progress.wordStars} ⭐</p>
            <p className="text-xs font-bold text-slate-500">Spelling, Phonics & Stories</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-emerald-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl shrink-0">
            🏝️
          </div>
          <div>
            <p className="text-xs font-black uppercase text-emerald-800">Puzzle Stars</p>
            <p className="text-2xl font-black text-emerald-950">{progress.puzzleStars} ⭐</p>
            <p className="text-xs font-bold text-slate-500">Riddles, Shapes & Animal Pairs</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-teal-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-3xl shrink-0">
            🌍
          </div>
          <div>
            <p className="text-xs font-black uppercase text-teal-800">Knowledge Stars</p>
            <p className="text-2xl font-black text-teal-950">{progress.knowledgeStars || 0} ⭐</p>
            <p className="text-xs font-bold text-slate-500">Science, Space, Nature & History</p>
          </div>
        </div>
      </div>

      {/* Magical Treasure Chests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif]">
            Magical Treasure Chests
          </h3>
        </div>
        <p className="text-sm font-bold text-slate-600">
          Reach star milestones to unlock magical surprises and secret stickers!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chests.map((chest) => {
            const isOpened = progress.openedChests.includes(chest.id);
            const canOpen = progress.totalStars >= chest.starsRequired && !isOpened;

            return (
              <motion.div
                key={chest.id}
                whileHover={{ scale: 1.02 }}
                className={`rounded-3xl p-6 shadow-lg border-b-6 relative overflow-hidden flex flex-col justify-between text-white ${
                  isOpened
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-900'
                    : canOpen
                    ? `bg-gradient-to-br ${chest.colour} border-amber-900 animate-pulse`
                    : 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl drop-shadow select-none">
                      {isOpened ? '✨' : '🎁'}
                    </span>
                    <span className="px-3 py-1 bg-black/30 backdrop-blur-xs rounded-full text-xs font-black">
                      {isOpened ? 'UNLOCKED' : `${chest.starsRequired} Stars Required`}
                    </span>
                  </div>

                  <h4 className="text-xl font-black font-['Fredoka',sans-serif] mb-1">
                    {chest.name}
                  </h4>
                  <p className="text-white/80 text-xs font-bold mb-3">
                    {chest.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  {isOpened ? (
                    <div className="flex items-center gap-2 text-emerald-200 text-sm font-black">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>{chest.rewardName}</span>
                    </div>
                  ) : canOpen ? (
                    <button
                      onClick={() => handleOpenChest(chest.id)}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl shadow-md border-b-3 border-amber-600 active:border-b-0 active:translate-y-0.5 transition-all"
                    >
                      🌟 Open Chest Now!
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Need {chest.starsRequired - progress.totalStars} more stars</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quest Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Quest Badges
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-black text-purple-900 bg-purple-100 px-3 py-1.5 rounded-full">
            {unlockedBadgesCount} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border-3 text-center transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-2xl bg-white shadow-xs text-3xl border border-slate-100">
                    {isUnlocked ? (
                      <span className="animate-wiggle">{badge.icon}</span>
                    ) : (
                      <Lock className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-black text-base text-slate-800 font-['Fredoka',sans-serif]">
                    {badge.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-600 mt-1 line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <span
                    className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? 'Earned ✨' : badge.requirementText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
