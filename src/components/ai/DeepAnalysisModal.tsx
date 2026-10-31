import React, { useState } from 'react';
import { X, Sparkles, Brain, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { Asset } from '../../types/market';

interface DeepAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const DeepAnalysisModal: React.FC<DeepAnalysisModalProps> = ({ isOpen, onClose, asset }) => {
  const [userQuery, setUserQuery] = useState(
    'Assess current multi-timeframe liquidity sweep, key Fibonacci golden zone (61.8%), RSI divergence, and generate an institutional 1:2 Risk-to-Reward trade setup.'
  );
  const [timeframe, setTimeframe] = useState('15m');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('gemini-4-argon (ThinkingLevel.HIGH)');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: asset.symbol,
          timeframe,
          indicators: {
            currentPrice: asset.basePrice,
            pipSize: asset.pipSize,
            type: asset.type,
          },
          userQuery,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setModelUsed(data.model === 'gemini-4-argon' ? 'gemini-4-argon (ThinkingLevel.HIGH)' : 'gemini-3.8-flash (Standard)');
      } else if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to complete deep reasoning.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Subtle glow */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Gemini 4 Argon Deep Market Reasoning
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  HIGH THINKING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional-grade quantitative analysis & risk-to-reward parameters for {asset.symbol}
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

        {/* Query Input Area */}
        <div className="my-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Target Asset: <span className="text-cyan-400 font-bold">{asset.symbol} ({asset.name})</span></span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">Timeframe:</span>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1D">Daily (1D)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Analysis Directive / Setup Query:
            </label>
            <textarea
              rows={2}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Synthesizing Deep Multi-Timeframe Model Reasoning...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute Deep Reasoning Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {analysisResult ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Analysis Generated Successfully
                </span>
                <span className="font-mono text-purple-300 text-[10px] bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                  {modelUsed}
                </span>
              </div>
              <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {analysisResult}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-2">
              <Brain className="w-8 h-8 text-slate-700" />
              <p>Click "Execute Deep Reasoning Analysis" to run Gemini 4 Argon with high thinking mode on {asset.symbol}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
