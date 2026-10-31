import React, { useState } from 'react';
import { HelpCircle, Check, ArrowRight, Sparkles, AlertCircle, Globe2, Building2 } from 'lucide-react';
import { OnboardingPoll } from '../../types/market';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface BeginnerPollModalProps {
  isOpen: boolean;
  onSubmitPoll: (poll: OnboardingPoll) => void;
  language?: Language;
}

export const BeginnerPollModal: React.FC<BeginnerPollModalProps> = ({
  isOpen,
  onSubmitPoll,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  const [selectedMarket, setSelectedMarket] = useState<'forex' | 'indian_stock'>('forex');
  const [referralSource, setReferralSource] = useState('YouTube / Podcast');
  const [showForcedForexNotice, setShowForcedForexNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const referralOptions = [
    'YouTube / Trading Podcast',
    'Friend or Trader Recommendation',
    'Reddit / Discord Trading Community',
    'Instagram / Financial Creator',
    'Google Search',
  ];

  const handleMarketSelect = (market: 'forex' | 'indian_stock') => {
    setSelectedMarket(market);
    if (market === 'indian_stock') {
      setShowForcedForexNotice(true);
    } else {
      setShowForcedForexNotice(false);
    }
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    const pollData: OnboardingPoll = {
      selectedMarket,
      referralSource,
      experienceLevel: 'Complete Beginner',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('/api/onboarding/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      });
    } catch (e) {
      console.warn('Poll save failed locally fallback:', e);
    } finally {
      setIsSubmitting(false);
      onSubmitPoll(pollData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Step 1 of 2: Beginner Onboarding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.pollTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.pollSubtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              {t.whichMarket}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleMarketSelect('forex')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedMarket === 'forex'
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedMarket === 'forex' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Forex Market
                    {selectedMarket === 'forex' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    24/5 Global Currencies (EUR/USD, GBP/USD, USD/JPY)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleMarketSelect('indian_stock')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedMarket === 'indian_stock'
                    ? 'border-amber-500 bg-amber-950/40 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedMarket === 'indian_stock' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Indian Stock Market
                    {selectedMarket === 'indian_stock' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    NSE / BSE (Reliance, TCS, Nifty)
                  </div>
                </div>
              </button>
            </div>

            {/* Forced Forex notice if user picked Indian Stock Market */}
            {showForcedForexNotice && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-bold">Forex Fast-Track Activated:</span> You selected the Indian Stock Market! Our NSE/BSE masterclass is scheduled for Phase 2. To build rock-solid candlestick and order execution fundamentals, our interactive simulator will first direct you to the 24/5 Forex curriculum.
                </div>
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              2. How did you hear about us?
            </label>
            <div className="space-y-2">
              {referralOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setReferralSource(opt)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all ${
                    referralSource === opt
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-semibold'
                      : 'border-slate-800 bg-slate-800/30 text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{opt}</span>
                  {referralSource === opt && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Start Interactive Guided Tour</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
