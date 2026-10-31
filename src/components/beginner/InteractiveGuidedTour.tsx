import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
  PenTool,
  DollarSign,
  Calendar,
  Globe,
  Languages,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechAgent, VoiceLanguage } from '../../utils/speechAgent';
import { TourStepItem } from '../../types/admin';
import { DEFAULT_TOUR_STEPS } from '../../data/defaultTourData';
import { getStepVoiceScript } from '../../utils/adminTourMath';

interface InteractiveGuidedTourProps {
  onCompleteTour: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  customSteps?: TourStepItem[];
}

export const InteractiveGuidedTour: React.FC<InteractiveGuidedTourProps> = ({
  onCompleteTour,
  isMuted,
  onToggleMute,
  customSteps,
}) => {
  const activeSteps = customSteps && customSteps.length > 0 ? customSteps : DEFAULT_TOUR_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLanguage>('en');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentStep = activeSteps[Math.min(currentStepIndex, activeSteps.length - 1)];
  const currentVoiceScript = getStepVoiceScript(currentStep, voiceLang);

  // Sample static candlestick data for bare chart simulation
  const sampleCandles = [
    { o: 1.0820, h: 1.0845, l: 1.0815, c: 1.0840 },
    { o: 1.0840, h: 1.0855, l: 1.0830, c: 1.0832 },
    { o: 1.0832, h: 1.0860, l: 1.0828, c: 1.0858 },
    { o: 1.0858, h: 1.0872, l: 1.0850, c: 1.0865 },
    { o: 1.0865, h: 1.0868, l: 1.0842, c: 1.0846 },
    { o: 1.0846, h: 1.0852, l: 1.0838, c: 1.0849 },
    { o: 1.0849, h: 1.0880, l: 1.0845, c: 1.0875 },
    { o: 1.0875, h: 1.0892, l: 1.0868, c: 1.0888 },
    { o: 1.0888, h: 1.0895, l: 1.0870, c: 1.0874 },
    { o: 1.0874, h: 1.0910, l: 1.0871, c: 1.0905 },
    { o: 1.0905, h: 1.0918, l: 1.0898, c: 1.0912 },
    { o: 1.0912, h: 1.0925, l: 1.0902, c: 1.0906 },
    { o: 1.0906, h: 1.0935, l: 1.0900, c: 1.0930 },
  ];

  // Draw bare candlestick chart onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;

    for (let y = 40; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 60, y);
      ctx.stroke();

      // Price labels on right axis
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      const priceVal = (1.0950 - (y / height) * 0.015).toFixed(4);
      ctx.fillText(priceVal, width - 52, y + 3);
    }

    const minPrice = 1.0800;
    const maxPrice = 1.0950;
    const priceRange = maxPrice - minPrice;

    const getY = (price: number) => {
      return height - ((price - minPrice) / priceRange) * (height - 40) - 20;
    };

    const candleWidth = Math.max(12, (width - 100) / sampleCandles.length - 10);

    sampleCandles.forEach((c, i) => {
      const x = 30 + i * (candleWidth + 10);
      const isUp = c.c >= c.o;
      const color = isUp ? '#10b981' : '#f43f5e';

      const yOpen = getY(c.o);
      const yClose = getY(c.c);
      const yHigh = getY(c.h);
      const yLow = getY(c.l);

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
    });
  }, [currentStepIndex]);

  // Voice narration triggers when step changes or language switches
  useEffect(() => {
    speechAgent.setMuted(isMuted);
    speechAgent.setLanguage(voiceLang);

    setIsSpeaking(true);
    speechAgent.speak(currentVoiceScript, () => {
      setIsSpeaking(false);
      if (currentStep.id === 6) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, voiceLang);

    return () => {
      speechAgent.stop();
    };
  }, [currentStepIndex, isMuted, voiceLang]);

  const handleNext = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onCompleteTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    speechAgent.stop();
    onCompleteTour();
  };

  const handleReplayVoice = () => {
    speechAgent.stop();
    setIsSpeaking(true);
    speechAgent.speak(currentVoiceScript, () => {
      setIsSpeaking(false);
    }, voiceLang);
  };

  const handleLanguageChange = (newLang: VoiceLanguage) => {
    setVoiceLang(newLang);
    speechAgent.setLanguage(newLang);
  };

  // Progression booleans for UI elements
  const showIndicators = currentStepIndex >= 1;
  const showDrawing = currentStepIndex >= 2;
  const showOrders = currentStepIndex >= 3;
  const showCalendar = currentStepIndex >= 4;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950 p-3 sm:p-6 flex flex-col justify-between">
      {/* Voice & Dynamic Text Agent Floating Overlay */}
      <div className="mb-4 z-20 bg-slate-900/95 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Agent Avatar & Waveform */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Interactive AI Voice Agent
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  Step {currentStep.id} of {activeSteps.length}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {currentStep.title}
              </h4>
            </div>
          </div>

          {/* Voice Agent Language Selector Strictly for Voice & Accompanying Text Box */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-400">Voice Language:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  voiceLang === 'en'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  voiceLang === 'hi'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('pa')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  voiceLang === 'pa'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>

          {/* Controls: Replay, Mute, Prev, Next, Skip */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleReplayVoice}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Replay Voice Explanation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>{currentStepIndex === activeSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSkip}
              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Dynamic Speech Text Box with Audio Pulse Visualization */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          {/* Animated audio bar waves */}
          <div className="flex items-center gap-0.5 pt-1 flex-shrink-0">
            <span className={`w-1 rounded-full bg-emerald-500 ${isSpeaking ? 'h-4 animate-bounce' : 'h-1.5'}`} />
            <span className={`w-1 rounded-full bg-teal-400 ${isSpeaking ? 'h-6 animate-pulse' : 'h-2'}`} />
            <span className={`w-1 rounded-full bg-cyan-400 ${isSpeaking ? 'h-3 animate-bounce' : 'h-1.5'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 ${isSpeaking ? 'h-5 animate-pulse' : 'h-2.5'}`} />
          </div>
          <div className="flex-1">
            <p className="italic text-slate-200 font-medium">
              "{currentVoiceScript}"
            </p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
              <span className="font-semibold text-emerald-400 uppercase">
                {voiceLang === 'en' ? 'English Voice & Subtitles' : voiceLang === 'hi' ? 'हिन्दी आवाज़ एवं उपशीर्षक' : 'ਪੰਜਾਬੀ ਆਵਾਜ਼ ਅਤੇ ਉਪਸਿਰਲੇਖ'}
              </span>
              <span>• Rest of interface in English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive UI Reveal Canvas & Workspace */}
      <div className="relative flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[460px]">
        {/* Step 2: Technical Indicators Toolbar (Fades in) */}
        <div
          className={`h-11 border-b border-slate-800 bg-slate-950/70 px-4 flex items-center justify-between transition-all duration-700 ${
            showIndicators ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Indicators:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] font-mono border border-emerald-500/20">
              SMA 20
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[11px] font-mono border border-cyan-500/20">
              SMA 50
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[11px] font-mono border border-purple-500/20">
              RSI 14 (58.4)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20 hidden sm:inline-block">
              MACD (12, 26, 9)
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">
            ✓ Technical Toolbar Active
          </span>
        </div>

        {/* Middle Body: Left Toolbar + Center Chart + Right Order Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Step 3: Drawing Tools Sidebar (Fades in) */}
          <div
            className={`w-14 border-r border-slate-800 bg-slate-950/60 p-2 flex flex-col items-center gap-3 transition-all duration-700 ${
              showDrawing ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400" title="Cursor Tool">
              <PenTool className="w-4 h-4" />
            </div>
            <div className="w-8 h-[1px] bg-slate-800" />
            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono" title="Trendline">
              TL
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono" title="Horizontal Ray">
              HR
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono" title="Fibonacci Retracement">
              FIB
            </button>
          </div>

          {/* Center Chart (Bare Candlesticks) */}
          <div className="flex-1 relative flex flex-col justify-center items-center p-2 bg-slate-950/40">
            <div className="absolute top-3 left-4 flex items-center gap-3">
              <span className="font-extrabold text-sm text-white">EUR/USD</span>
              <span className="text-xs text-slate-400">15m Candlestick (Bare Initial View)</span>
              <span className="font-mono text-xs font-bold text-emerald-400">1.08500</span>
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={320}
              className="w-full max-w-4xl h-[280px] sm:h-[320px] rounded-xl"
            />
          </div>

          {/* Step 4: Paper Trading Buy/Sell Panel (Fades in) */}
          <div
            className={`w-64 border-l border-slate-800 bg-slate-950/90 p-4 flex flex-col justify-between transition-all duration-700 ${
              showOrders ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                  Paper Trading Panel
                </h5>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Virtual Balance</span>
                <div className="text-base font-extrabold text-emerald-400 font-mono">$100,000.00</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-400">BUY / LONG</span>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">1.08508</div>
                </div>
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-rose-400">SELL / SHORT</span>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">1.08500</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Lot Size (Standard)</label>
                  <input
                    type="text"
                    disabled
                    value="1.00 Lot ($10/pip)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Leverage</label>
                  <input
                    type="text"
                    disabled
                    value="1:100 (Forex Standard)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300">
              ✓ Virtual risk-free capital funded.
            </div>
          </div>
        </div>

        {/* Step 5: Global Session Clock & Economic Calendar (Fades in) */}
        <div
          className={`h-12 border-t border-slate-800 bg-slate-950/80 px-4 flex items-center justify-between transition-all duration-700 ${
            showCalendar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">Session Overlap:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              London & New York Overlap (Peak Volatility)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 hidden sm:inline">
              Upcoming: US Non-Farm Payrolls (NFP) in 2h 45m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
