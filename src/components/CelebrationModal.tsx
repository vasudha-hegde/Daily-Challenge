import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, X } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { sound } from '../utils/sound';

export const CelebrationModal: React.FC = () => {
  const { celebration, clearCelebration } = useProgress();

  if (!celebration) return null;

  const handleClose = () => {
    sound.playPop();
    clearCelebration();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-md bg-gradient-to-b from-amber-100 to-amber-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 bg-white/70 rounded-full transition-transform active:scale-95"
            aria-label="Close celebration"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating badge icon */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full shadow-lg border-4 border-white mb-4 animate-bounce">
            <span className="text-5xl sm:text-6xl drop-shadow">{celebration.icon}</span>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-500 animate-spin" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-amber-900 font-['Fredoka',sans-serif]">
            {celebration.title}
          </h3>

          <p className="mt-2 text-base sm:text-lg font-bold text-slate-700">
            {celebration.subtitle}
          </p>

          {celebration.starsAdded && (
            <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-amber-200/80 rounded-full text-amber-900 font-extrabold text-lg">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              <span>+{celebration.starsAdded} Bonus Stars!</span>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleClose}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl rounded-2xl shadow-lg border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              🌟 Brilliant! Keep Going!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
