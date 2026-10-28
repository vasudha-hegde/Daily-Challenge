import React from 'react';
import { Volume2, VolumeX, Sparkles, Home, Shield, Flame } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';

interface HeaderProps {
  currentCategory: string | null;
  onNavigateHome: () => void;
  onOpenParentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onNavigateHome,
  onOpenParentModal,
}) => {
  const { progress, toggleSound, currentRank } = useProgress();

  const handleSoundClick = () => {
    sound.playPop();
    toggleSound();
  };

  const handleHomeClick = () => {
    sound.playPop();
    speech.stop();
    onNavigateHome();
  };

  const handleParentClick = () => {
    sound.playPop();
    speech.stop();
    onOpenParentModal();
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 border-b-4 border-amber-500 shadow-md px-3 sm:px-6 py-2 sm:py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Home / App Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentCategory ? (
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-white text-amber-900 font-extrabold rounded-2xl shadow-sm border-b-3 border-amber-300 active:border-b-0 active:translate-y-0.5 transition-all"
              aria-label="Back to Main Menu"
            >
              <Home className="w-5 h-5 text-amber-700" />
              <span className="hidden sm:inline text-sm font-black">Home</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl drop-shadow-sm select-none" role="img" aria-label="Owl mascot">
                🦉
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif] tracking-wide leading-tight">
                  Smaya&apos;s Brain Quest
                </h1>
                <p className="hidden md:block text-xs font-bold text-amber-900/80">
                  Year 2 &amp; 3 Learning Adventure 🇬🇧
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Rank & Current Streak (if active) */}
        <div className="hidden lg:flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
          <span className="text-lg">{currentRank.icon}</span>
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
            {currentRank.title}
          </span>
          {progress.currentStreak >= 2 && (
            <div className="flex items-center gap-1 pl-2 border-l border-amber-600/30 text-rose-800 font-black text-xs">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-600 animate-bounce" />
              <span>{progress.currentStreak} in a row!</span>
            </div>
          )}
        </div>

        {/* Right: Star Counter, Sound Toggle & Parents */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Star counter badge */}
          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-white/95 rounded-2xl shadow-inner border-2 border-amber-300 text-amber-950 font-black text-base sm:text-lg">
            <span className="text-xl sm:text-2xl animate-pulse">⭐</span>
            <span className="font-['Fredoka',sans-serif]">{progress.totalStars}</span>
            <span className="hidden sm:inline text-xs font-bold text-amber-800 ml-0.5">Stars</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundClick}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm border-b-2 border-amber-300 active:border-b-0 active:translate-y-0.5 transition-all"
            title={progress.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            aria-label={progress.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Parents Corner button */}
          <button
            onClick={handleParentClick}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm border-b-2 border-amber-300 active:border-b-0 active:translate-y-0.5 transition-all"
            title="Parents & Grown-ups Area"
            aria-label="Parents Area"
          >
            <Shield className="w-5 h-5 text-indigo-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
