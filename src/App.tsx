/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { DailyChallengeActivity } from './components/DailyChallenge/DailyChallengeActivity';
import { MathsActivity } from './components/MathsAdventure/MathsActivity';
import { WordActivity } from './components/WordWizard/WordActivity';
import { PuzzleActivity } from './components/PuzzleIsland/PuzzleActivity';
import { GeneralKnowledgeActivity } from './components/GeneralKnowledge/GeneralKnowledgeActivity';
import { MyStarsActivity } from './components/MyStars/MyStarsActivity';
import { CelebrationModal } from './components/CelebrationModal';
import { ParentModal } from './components/ParentModal';
import { Category } from './types';

const MainApp: React.FC = () => {
  const { progress, setActiveCategory, storageWarning, dismissStorageWarning } = useProgress();
  const currentCategory = progress.activeCategory || null;
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBEB] text-slate-800 selection:bg-amber-200">
      {/* Storage Warning Banner if localStorage is unavailable */}
      {storageWarning && (
        <div className="bg-amber-400 text-amber-950 px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-sm border-b-2 border-amber-500">
          <div className="flex items-center gap-2 mx-auto">
            <span>⚠️ Storage Notice: Browser local storage is disabled or unavailable. Progress might not save on refresh.</span>
          </div>
          <button
            onClick={dismissStorageWarning}
            className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-black cursor-pointer shrink-0"
            aria-label="Dismiss warning"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentCategory={currentCategory}
        onNavigateHome={() => setActiveCategory(null)}
        onOpenParentModal={() => setIsParentModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {currentCategory === null && (
          <HomeScreen onSelectCategory={(cat) => setActiveCategory(cat)} />
        )}
        {currentCategory === 'daily' && (
          <DailyChallengeActivity
            onChooseExtraPractice={(cat) => setActiveCategory(cat)}
          />
        )}
        {currentCategory === 'maths' && <MathsActivity />}
        {currentCategory === 'words' && <WordActivity />}
        {currentCategory === 'puzzles' && <PuzzleActivity />}
        {currentCategory === 'knowledge' && <GeneralKnowledgeActivity />}
        {currentCategory === 'stars' && <MyStarsActivity />}
      </main>

      {/* Subtle child-friendly footer with friendly encouragement */}
      <footer className="py-4 text-center text-xs font-bold text-amber-900/60 border-t border-amber-200/60">
        <p>Smaya&apos;s Brain Quest • Key Stage 1 &amp; 2 Learning Adventure 🇬🇧</p>
        <p className="mt-0.5 text-[11px] text-amber-800/50">
          No ads • No tracking • 100% private local play
        </p>
      </footer>

      {/* Pop-up celebration for badges and chests */}
      <CelebrationModal />

      {/* Parent Area Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <MainApp />
    </ProgressProvider>
  );
}
