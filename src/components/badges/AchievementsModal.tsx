import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, TrendingUp, Compass, Headphones, Brain, Globe } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../../data/educationalContent';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  const iconMap: Record<string, React.ReactNode> = {
    Compass: <Compass className="w-5 h-5" />,
    MapPin: <Sparkles className="w-5 h-5" />,
    GraduationCap: <Award className="w-5 h-5" />,
    Headphones: <Headphones className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    DollarSign: <Award className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
  };

  const unlockedCount = INITIAL_ACHIEVEMENTS.filter((b) => unlockedBadgeIds.includes(b.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-yellow-500/20">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Gamified Achievements</h3>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {INITIAL_ACHIEVEMENTS.length} Badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {INITIAL_ACHIEVEMENTS.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-yellow-500/40 shadow-sm shadow-yellow-500/5'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? iconMap[badge.icon] || <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
