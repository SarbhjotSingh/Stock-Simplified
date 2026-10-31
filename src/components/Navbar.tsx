import React, { useState } from 'react';
import {
  TrendingUp,
  GraduationCap,
  LayoutDashboard,
  Calendar,
  Sparkles,
  Award,
  RotateCcw,
  Volume2,
  VolumeX,
  User,
  Globe,
  Languages,
} from 'lucide-react';
import { UserProfile, AccountState } from '../types/market';
import { getMarketSessions } from '../utils/tradingMath';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentPathway: 'beginner' | 'advanced' | null;
  onSelectPathway: (pathway: 'beginner' | 'advanced') => void;
  account: AccountState;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onResetBalance: () => void;
  onOpenCalendar: () => void;
  onOpenVoiceCoach: () => void;
  onOpenDeepAnalysis: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBadges: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPathway,
  onSelectPathway,
  account,
  user,
  onOpenAuth,
  onResetBalance,
  onOpenCalendar,
  onOpenVoiceCoach,
  onOpenDeepAnalysis,
  isMuted,
  onToggleMute,
  onOpenBadges,
  language,
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[language];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentUtcHour = new Date().getUTCHours();
  const sessionInfo = getMarketSessions(currentUtcHour);
  const activeSessionNames = sessionInfo.sessions.filter((s) => s.isOpen).map((s) => s.name.replace(' Session', ''));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20 text-slate-950">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Stock Simplified
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO SIMULATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Forex Education & Real-Time Paper Trading
            </p>
          </div>
        </div>

        {/* Pathway Navigation Switcher */}
        <div className="hidden md:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => onSelectPathway('beginner')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPathway === 'beginner'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {t.beginnerPathway}
          </button>
          <button
            onClick={() => onSelectPathway('advanced')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPathway === 'advanced'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {t.advancedCharting}
          </button>
        </div>

        {/* Global Market Session Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              {activeSessionNames.length > 0 ? activeSessionNames.join(' + ') : 'Global Forex'}
            </span>
            {sessionInfo.isPeakOverlap && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Peak Overlap
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Virtual Capital, Action Icons, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase text-[11px] font-mono">
                {language === 'en' ? 'EN' : language === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1 space-y-0.5 animate-fade-in text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    onSelectLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    language === 'hi' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectLanguage('pa');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    language === 'pa' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ਪੰਜਾਬੀ (Punjabi)
                </button>
              </div>
            )}
          </div>

          {/* Virtual Capital Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t.virtualBalance}
              </div>
              <div className="font-mono font-bold text-sm text-emerald-400">
                ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <button
              onClick={onResetBalance}
              title={t.resetBalance}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Market Reasoning Trigger */}
          <button
            onClick={onOpenDeepAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
            title="Ask Gemini 4 High-Thinking Market Reasoning"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">{t.aiQuant}</span>
          </button>

          {/* Live Voice Coach / Audio Assistant */}
          <button
            onClick={onOpenVoiceCoach}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl transition-colors relative"
            title="Open Voice & Text Mentor"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Economic Calendar Trigger */}
          <button
            onClick={onOpenCalendar}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 rounded-xl transition-colors relative"
            title={t.economicCalendar}
          >
            <Calendar className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
          </button>

          {/* Achievements Badges */}
          <button
            onClick={onOpenBadges}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-400 hover:text-yellow-300 rounded-xl transition-colors flex items-center gap-1"
            title="View Achievement Badges"
          >
            <Award className="w-4 h-4" />
            <span className="text-[11px] font-bold text-slate-300 hidden sm:inline">
              {user?.badges?.length || 1}
            </span>
          </button>

          {/* Mute/Unmute audio narration */}
          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
            title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2 sm:px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 transition-colors"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
            ) : (
              <User className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-medium hidden sm:inline">{user?.name || t.login}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
