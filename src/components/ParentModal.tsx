import React, { useState } from 'react';
import { X, ShieldAlert, RotateCcw, Check, HeartHandshake, Sparkles, Trophy, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { sound } from '../utils/sound';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({ isOpen, onClose }) => {
  const { progress, resetProgress, badges } = useProgress();
  const [unlocked, setUnlocked] = useState(false);
  const [parentAnswer, setParentAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Adult verification check
  const num1 = 9;
  const num2 = 6;
  const expectedAnswer = num1 + num2; // 15

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentAnswer.trim(), 10) === expectedAnswer) {
      setUnlocked(true);
      setErrorMsg('');
      sound.playPop();
    } else {
      setErrorMsg('Incorrect answer. Please try again.');
      sound.playEncouragingRetry();
    }
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
    setResetSuccess(true);
    sound.playPop();
    setTimeout(() => {
      setResetSuccess(false);
      setUnlocked(false);
      setParentAnswer('');
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setUnlocked(false);
    setParentAnswer('');
    setErrorMsg('');
    setConfirmReset(false);
    setResetSuccess(false);
    onClose();
  };

  // Calculate subject accuracies
  const getSubjectAccuracy = (attempts: number, correct: number) => {
    if (attempts === 0) return 0;
    return Math.round((correct / attempts) * 100);
  };

  const mathsAcc = getSubjectAccuracy(progress.subjectStats.maths.attempts, progress.subjectStats.maths.correct);
  const wordsAcc = getSubjectAccuracy(progress.subjectStats.words.attempts, progress.subjectStats.words.correct);
  const puzzlesAcc = getSubjectAccuracy(progress.subjectStats.puzzles.attempts, progress.subjectStats.puzzles.correct);
  const knowledgeAcc = getSubjectAccuracy(
    progress.subjectStats.knowledge?.attempts || 0,
    progress.subjectStats.knowledge?.correct || 0
  );

  const totalAttempts =
    progress.subjectStats.maths.attempts +
    progress.subjectStats.words.attempts +
    progress.subjectStats.puzzles.attempts +
    (progress.subjectStats.knowledge?.attempts || 0);

  const daily = progress.dailyChallenge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-transform active:scale-95 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!unlocked ? (
          <div>
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <HeartHandshake className="w-7 h-7" />
              <h3 className="text-2xl font-bold font-['Fredoka',sans-serif]">Parents & Grown-ups Dashboard</h3>
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              To keep Smaya&apos;s learning experience safe from accidental resets, please confirm adult access:
            </p>

            <form onSubmit={handleVerify} className="space-y-4 max-w-sm mx-auto">
              <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-center">
                <span className="text-xl font-bold text-indigo-900">
                  What is {num1} + {num2}?
                </span>
              </div>

              <input
                type="number"
                value={parentAnswer}
                onChange={(e) => setParentAnswer(e.target.value)}
                placeholder="Enter answer"
                className="w-full text-center text-2xl font-black p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-500"
                autoFocus
              />

              {errorMsg && <p className="text-rose-600 text-sm font-semibold text-center">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
              >
                Open Parent Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                  Parent Learning Dashboard
                </h3>
              </div>
              <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                Smaya&apos;s Progress (Years 2 & 3)
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <p className="text-amber-800 font-bold text-xs uppercase">Total Stars</p>
                <p className="text-2xl font-black text-amber-600">⭐ {progress.totalStars}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <p className="text-emerald-800 font-bold text-xs uppercase">Daily Quests Won</p>
                <p className="text-2xl font-black text-emerald-600">🗓️ {progress.dailyChallengesCompletedCount}</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                <p className="text-blue-800 font-bold text-xs uppercase">Total Attempts</p>
                <p className="text-2xl font-black text-blue-600">{totalAttempts}</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-center">
                <p className="text-purple-800 font-bold text-xs uppercase">Badges</p>
                <p className="text-2xl font-black text-purple-600">{progress.unlockedBadges.length} / {badges.length}</p>
              </div>
            </div>

            {/* Subject Accuracy Breakdown */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <h4 className="font-black text-base text-slate-800 font-['Fredoka',sans-serif]">
                  Accuracy by Subject
                </h4>
              </div>

              {/* Maths Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>🧮 Maths Adventures</span>
                  <span>
                    {progress.subjectStats.maths.correct} / {progress.subjectStats.maths.attempts} correct ({mathsAcc}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${mathsAcc}%` }}
                  />
                </div>
              </div>

              {/* Words Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>🧙‍♂️ Word Wizard (Spelling & Reading)</span>
                  <span>
                    {progress.subjectStats.words.correct} / {progress.subjectStats.words.attempts} correct ({wordsAcc}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${wordsAcc}%` }}
                  />
                </div>
              </div>

              {/* Puzzles Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>🏝️ Puzzle Island (Logic & Shapes)</span>
                  <span>
                    {progress.subjectStats.puzzles.correct} / {progress.subjectStats.puzzles.attempts} correct ({puzzlesAcc}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${puzzlesAcc}%` }}
                  />
                </div>
              </div>

              {/* General Knowledge Accuracy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>🌍 General Knowledge (Science, History & World)</span>
                  <span>
                    {progress.subjectStats.knowledge?.correct || 0} / {progress.subjectStats.knowledge?.attempts || 0} correct ({knowledgeAcc}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${knowledgeAcc}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Daily Challenge Summary */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-200 rounded-xl text-xl">🗓️</div>
                <div>
                  <p className="text-xs font-black uppercase text-amber-800">Today&apos;s Daily Challenge ({daily?.date})</p>
                  <p className="text-sm font-bold text-amber-950">
                    {daily?.isCompleted
                      ? `Completed! Score: ${daily.score} / ${daily?.questions?.length || 30} ⭐`
                      : `In Progress: ${daily?.completedIndices.length || 0} / ${daily?.questions?.length || 30} questions completed`}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${daily?.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'}`}>
                {daily?.isCompleted ? 'Finished ✨' : 'Active'}
              </span>
            </div>

            {/* Recent Activity Feed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h4 className="font-black text-sm text-slate-800 font-['Fredoka',sans-serif]">
                  Recent Activity (Last {progress.recentActivity.length} Questions)
                </h4>
              </div>

              {progress.recentActivity.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                  No questions answered yet. As Smaya practices, recent attempts will appear here!
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {progress.recentActivity.slice(0, 15).map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {act.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="font-bold text-slate-800 truncate max-w-xs">
                          {act.questionPrompt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        {act.starsEarned > 0 && (
                          <span className="text-amber-600 font-black">+{act.starsEarned}⭐</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-700">🔒 Local & Safe for Children:</p>
              <p>• Built strictly to the Key Stage 1 (Year 2) National Curriculum for England.</p>
              <p>• Zero third-party trackers, no accounts, and no paid cloud APIs.</p>
              <p>• All progress is saved in this browser&apos;s local memory.</p>
            </div>

            {/* Reset progress */}
            <div className="border-t pt-4">
              {resetSuccess ? (
                <div className="p-3 bg-green-100 text-green-800 rounded-xl flex items-center justify-center gap-2 font-bold">
                  <Check className="w-5 h-5 text-green-600" />
                  Progress reset successfully!
                </div>
              ) : confirmReset ? (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <ShieldAlert className="w-5 h-5" />
                    Are you sure you want to reset all stars and badges?
                  </div>
                  <p className="text-xs text-rose-600">
                    This will clear all saved stars, chests, daily streak, and activity so Smaya can start fresh.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-2 border-slate-200 hover:border-rose-300 font-bold rounded-xl text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Progress (Start Fresh)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
