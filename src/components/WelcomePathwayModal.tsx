import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Headphones,
  CheckCircle2,
  LineChart,
} from 'lucide-react';

import { Language, TRANSLATIONS } from '../i18n/translations';

interface WelcomePathwayModalProps {
  isOpen: boolean;
  onSelectOptionA: () => void;
  onSelectOptionB: () => void;
  userName?: string;
  language?: Language;
}

export const WelcomePathwayModal: React.FC<WelcomePathwayModalProps> = ({
  isOpen,
  onSelectOptionA,
  onSelectOptionB,
  userName = 'Trader',
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        {/* Glow elements */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Stock Simplified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {t.welcomeTitle}, {userName}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Pathway Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Option A: Complete Beginner */}
          <div
            onClick={onSelectOptionA}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border-2 border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer"
          >
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wide">
              Recommended
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t.optionATitle}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mb-3">
                {t.optionASubtitle}
              </p>
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>2-Question Market Onboarding Poll</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Interactive Voice Agent & Progressive UI Reveal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Audio Podcast Player (PIPs, Lots & Leverage)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Forex Session Overlap Clock & Indicators</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>{t.startBeginner}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Option B: Advanced Interface */}
          <div
            onClick={onSelectOptionB}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border-2 border-slate-700 hover:border-cyan-500/80 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {t.optionBTitle}
              </h3>
              <p className="text-xs text-cyan-400 font-semibold mb-3">
                {t.optionBSubtitle}
              </p>
              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Multi-Timeframe Candlestick Workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Trendline & Fibonacci Retracement Tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Technical Indicators (SMA, RSI, MACD)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>$100k Virtual Paper Trading Order Panel & P&L</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-cyan-500/30 group-hover:border-transparent"
            >
              <span>{t.launchAdvanced}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
