import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  Clock,
  Layers,
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AUDIO_CHAPTERS } from '../../data/educationalContent';
import { AudioChapter, AchievementBadge } from '../../types/market';
import { speechAgent } from '../../utils/speechAgent';
import { getMarketSessions } from '../../utils/tradingMath';

interface EducationalHubProps {
  onUnlockBadge: (badgeId: string) => void;
  unlockedBadges: string[];
  isMuted: boolean;
  onToggleMute: () => void;
  customPodcasts?: AudioChapter[];
}

export const EducationalHub: React.FC<EducationalHubProps> = ({
  onUnlockBadge,
  unlockedBadges,
  isMuted,
  onToggleMute,
  customPodcasts,
}) => {
  const activeEpisodes = customPodcasts && customPodcasts.length > 0 ? customPodcasts : AUDIO_CHAPTERS;
  const [selectedChapter, setSelectedChapter] = useState<AudioChapter>(activeEpisodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'podcast' | 'sessions' | 'pairs' | 'indicators'>('podcast');
  const [speechProgress, setSpeechProgress] = useState(0);

  const currentUtcHour = new Date().getUTCHours();
  const sessionData = getMarketSessions(currentUtcHour);

  // Handle SpeechSynthesis audio chapter playback
  const handleTogglePlay = (chapter: AudioChapter) => {
    if (selectedChapter.id === chapter.id && isPlaying) {
      speechAgent.stop();
      setIsPlaying(false);
    } else {
      setSelectedChapter(chapter);
      speechAgent.stop();
      setIsPlaying(true);

      // Award podcast scholar badge
      onUnlockBadge('podcast_scholar');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });

      speechAgent.speak(chapter.transcript, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleStopAudio = () => {
    speechAgent.stop();
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      speechAgent.stop();
    };
  }, []);

  // Major Currency Pairs breakdown
  const MAJOR_PAIRS = [
    {
      pair: 'EUR/USD',
      nickname: 'The Fiber',
      pipVal: '$10.00 / lot',
      avgRange: '75 pips/day',
      features: 'Highest global liquidity; tightest spreads. Driven by US Fed and ECB interest rate differential.',
      badge: 'Most Popular',
    },
    {
      pair: 'GBP/USD',
      nickname: 'Cable',
      pipVal: '$10.00 / lot',
      avgRange: '110 pips/day',
      features: 'High volatility during London-New York overlap; famous for swift trend continuation moves.',
      badge: 'High Volatility',
    },
    {
      pair: 'USD/JPY',
      nickname: 'The Gopher',
      pipVal: '~$6.50 / lot',
      avgRange: '95 pips/day',
      features: 'Pip at 2nd decimal (0.01). Strong hedge asset influenced by US Treasury yields and BoJ interventions.',
      badge: 'Safe Haven',
    },
    {
      pair: 'AUD/USD',
      nickname: 'The Aussie',
      pipVal: '$10.00 / lot',
      avgRange: '65 pips/day',
      features: 'Commodity currency tightly tied to iron ore, copper, gold, and Asian economic growth.',
      badge: 'Commodity Tied',
    },
    {
      pair: 'USD/CAD',
      nickname: 'The Loonie',
      pipVal: '~$7.20 / lot',
      avgRange: '70 pips/day',
      features: 'Canada is a major oil exporter; closely mirrors crude oil futures and Bank of Canada sentiment.',
      badge: 'Petro-Currency',
    },
  ];

  // Beginner Indicators Explanations
  const INDICATORS = [
    {
      name: 'Relative Strength Index (RSI)',
      type: 'Momentum Oscillator (0 to 100)',
      formula: 'Measures the velocity and magnitude of price changes.',
      interpretation: [
        'Above 70: Overbought — buyers may be exhausted, potential pullback or consolidation.',
        'Below 30: Oversold — sellers overwhelmed, potential bargain hunting bounce.',
        'Centerline (50): Delineates bullish trend bias (>50) versus bearish momentum (<50).',
      ],
      ruleOfThumb: 'Never buy purely because RSI is oversold; look for price structure rejection first.',
    },
    {
      name: 'Moving Averages (SMA & EMA)',
      type: 'Trend-Following Indicator',
      formula: 'Smooths historical price action into a dynamic trend line.',
      interpretation: [
        'SMA 20 & 50: Short-to-medium trend direction and dynamic support/resistance.',
        'SMA 200: Institutional baseline. Price above 200 SMA is in a long-term bull market.',
        'Golden Cross: When 50 SMA crosses above 200 SMA, signaling strong macro bullishness.',
      ],
      ruleOfThumb: 'Trade in the direction of the slope of the 50 and 200 Moving Averages.',
    },
    {
      name: 'Moving Average Convergence Divergence (MACD)',
      type: 'Trend & Momentum Combo',
      formula: '12-period EMA minus 26-period EMA with a 9-period Signal line.',
      interpretation: [
        'MACD Line crossing above Signal Line: Bullish momentum trigger.',
        'MACD Line crossing below Signal Line: Bearish momentum trigger.',
        'Histogram: Shows the distance between MACD and Signal line—expanding bars mean accelerating momentum.',
      ],
      ruleOfThumb: 'Watch for divergence: higher price highs with lower MACD highs indicates trend exhaustion.',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Option A: Complete Beginner Educational Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Master the Forex & Stock Markets
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Listen to narrated audio chapters, understand global market session overlaps, master major currency pairs, and build rock-solid paper trading intuition.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('podcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'podcast'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Podcast Player (Audio Chapters)
          </button>

          <button
            onClick={() => {
              setActiveTab('sessions');
              onUnlockBadge('session_master');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sessions'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Session Overlap Map
          </button>

          <button
            onClick={() => setActiveTab('pairs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pairs'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Major Currency Pairs
          </button>

          <button
            onClick={() => setActiveTab('indicators')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'indicators'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Beginner Indicators
          </button>
        </div>
      </div>

      {/* TAB 1: Podcast Player Hosting Audio Chapters */}
      {activeTab === 'podcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player Display */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Stock Simplified Audio Masterclass
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {selectedChapter.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleMute}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Description & Key Takeaways */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {selectedChapter.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Key Chapter Takeaways
                </h4>
                <ul className="space-y-2">
                  {selectedChapter.keyPoints.map((pt, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Audio Transcript Viewer */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 max-h-48 overflow-y-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Spoken Transcript:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "{selectedChapter.transcript}"
                </p>
              </div>
            </div>

            {/* Playback Controls & Waveform */}
            <div className="mt-8 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePlay(selectedChapter)}
                    className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  {isPlaying && (
                    <button
                      onClick={handleStopAudio}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                      title="Stop audio"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isPlaying ? 'Now Playing via Web Speech Voice' : 'Ready to Play'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Duration: {selectedChapter.duration}
                    </span>
                  </div>
                </div>

                {/* Animated waves when playing */}
                <div className="flex items-center gap-1">
                  <span className={`w-1 rounded-full bg-emerald-500 ${isPlaying ? 'h-6 animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 rounded-full bg-teal-400 ${isPlaying ? 'h-8 animate-pulse' : 'h-3'}`} />
                  <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'h-5 animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 rounded-full bg-emerald-400 ${isPlaying ? 'h-7 animate-pulse' : 'h-3'}`} />
                  <span className={`w-1 rounded-full bg-teal-300 ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Episode List Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              Podcast Chapters ({activeEpisodes.length})
            </h4>

            <div className="space-y-3">
              {activeEpisodes.map((ch, idx) => {
                const isSelected = selectedChapter.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => handleTogglePlay(ch)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Chapter {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ch.duration}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white mb-1">
                      {ch.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {ch.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Visual Guides on Forex Session Overlaps */}
      {activeTab === 'sessions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Global Forex Trading Sessions & Overlaps
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The Forex market runs 24 hours a day, 5 days a week across four major financial powerhouses.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Current UTC:</span>
              <span className="text-emerald-400 font-bold">{currentUtcHour.toString().padStart(2, '0')}:00 UTC</span>
            </div>
          </div>

          {/* Peak Overlap Callout Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  The Golden Hours: London & New York Overlap (13:00 - 17:00 UTC)
                  {sessionData.isPeakOverlap && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 animate-pulse">
                      ACTIVE NOW
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Accounts for over 70% of total daily global volume. Spreads are at their tightest, and liquidity is deepest. Perfect for EUR/USD and GBP/USD breakout strategies.
                </p>
              </div>
            </div>
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sessionData.sessions.map((sess) => (
              <div
                key={sess.name}
                className={`p-5 rounded-2xl border transition-all ${
                  sess.isOpen
                    ? 'bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">{sess.city}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sess.isOpen
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sess.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3 space-y-1">
                  <div>
                    <span className="text-slate-500">Trading Hours: </span>
                    <span className="text-slate-200 font-mono font-semibold">
                      {sess.startUTC.toString().padStart(2, '0')}:00 - {sess.endUTC.toString().padStart(2, '0')}:00 UTC
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Volatility: </span>
                    <span className="text-amber-400 font-semibold">{sess.volatility}</span>
                  </div>
                </div>

                {sess.overlapWith && sess.overlapWith.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
                    <span>⚡ Overlaps with {sess.overlapWith.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 24-Hour Visual Gantt Bar */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              24-Hour UTC Market Timeline
            </h4>
            <div className="relative h-12 w-full bg-slate-900 rounded-xl overflow-hidden flex border border-slate-800">
              {/* Sydney: 21 - 06 */}
              <div className="absolute top-1 bottom-1 left-[87.5%] right-0 bg-blue-500/40 rounded-l text-[9px] font-bold text-blue-300 flex items-center justify-center">
                Sydney
              </div>
              <div className="absolute top-1 bottom-1 left-0 w-[25%] bg-blue-500/40 rounded-r text-[9px] font-bold text-blue-300 flex items-center justify-center">
                Sydney
              </div>
              {/* Tokyo: 00 - 09 */}
              <div className="absolute top-2 bottom-2 left-0 w-[37.5%] bg-purple-500/40 rounded text-[9px] font-bold text-purple-300 flex items-center justify-center">
                Tokyo (00-09)
              </div>
              {/* London: 08 - 17 */}
              <div className="absolute top-1 bottom-1 left-[33.3%] w-[37.5%] bg-emerald-500/40 rounded text-[9px] font-bold text-emerald-300 flex items-center justify-center">
                London (08-17)
              </div>
              {/* New York: 13 - 22 */}
              <div className="absolute top-2 bottom-2 left-[54.1%] w-[37.5%] bg-cyan-500/50 rounded text-[9px] font-bold text-cyan-200 flex items-center justify-center">
                New York (13-22)
              </div>

              {/* Peak overlap indicator stripe */}
              <div className="absolute top-0 bottom-0 left-[54.1%] w-[16.7%] border-x-2 border-amber-400 bg-amber-400/20 pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded shadow">
                  PEAK (13-17)
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00 UTC</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Major Currency Pairs Breakdown */}
      {activeTab === 'pairs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Major Currency Pairs Deep Dive
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Currency pairs featuring the US Dollar (USD) on either the Base or Quote side account for 85% of all daily FX volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAJOR_PAIRS.map((p) => (
              <div
                key={p.pair}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-white">{p.pair}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 italic mb-3 font-medium">
                    "{p.nickname}"
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {p.features}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Pip Value (1 Lot)</span>
                    <span className="font-mono font-bold text-emerald-400">{p.pipVal}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-500 block">Avg Daily Range</span>
                    <span className="font-mono font-bold text-cyan-400">{p.avgRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Beginner-Friendly Indicators */}
      {activeTab === 'indicators' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Essential Technical Indicators Explained
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Learn how quantitative formulas turn raw price data into objective trend and momentum signals.
            </p>
          </div>

          <div className="space-y-6">
            {INDICATORS.map((ind) => (
              <div
                key={ind.name}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-base font-extrabold text-white">{ind.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 self-start sm:self-auto">
                    {ind.type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">{ind.formula}</p>

                <div className="space-y-2 mb-4">
                  {ind.interpretation.map((interp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{interp}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold">Golden Rule: </span>
                    <span>{ind.ruleOfThumb}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
