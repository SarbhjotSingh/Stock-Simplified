import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Clock, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { EconomicEvent } from '../../types/market';

interface EconomicCalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/market/economic-calendar');
        const data = await res.json();
        if (data.events) setEvents(data.events);
      } catch (err) {
        console.error('Failed to load calendar:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEvents = events.filter((ev) => {
    const currencyMatch = selectedCurrency === 'ALL' || ev.currency === selectedCurrency;
    const impactMatch = selectedImpact === 'ALL' || ev.impact === selectedImpact;
    return currencyMatch && impactMatch;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left text-slate-100">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Live Economic Calendar</h3>
            <p className="text-[11px] text-slate-400">Forex Market Moving Events & Catalysts</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Currency:</span>
          <div className="flex gap-1">
            {['ALL', 'USD', 'EUR', 'GBP', 'JPY'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCurrency(c)}
                className={`px-2 py-0.5 rounded-md font-mono font-bold transition-colors ${
                  selectedCurrency === c ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Impact:</span>
          <div className="flex gap-1">
            {['ALL', 'HIGH', 'MEDIUM'].map((imp) => (
              <button
                key={imp}
                onClick={() => setSelectedImpact(imp)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                  selectedImpact === imp ? 'bg-slate-700 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Loading live news catalysts...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No events matching filter criteria.</div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {ev.currency}
                  </span>
                  <span className="text-[11px] text-slate-400">{ev.time}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ev.impact === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {ev.impact} IMPACT
                </span>
              </div>

              <h4 className="text-xs font-bold text-white leading-snug">{ev.title}</h4>

              {/* Data numbers (Actual, Forecast, Previous) */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Actual</span>
                  <span className="font-bold text-emerald-400">{ev.actual || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Forecast</span>
                  <span className="text-slate-300">{ev.forecast}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Previous</span>
                  <span className="text-slate-400">{ev.previous}</span>
                </div>
              </div>

              {/* Volatility impact commentary */}
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-300 italic bg-slate-900/40 p-2 rounded-xl">
                💡 {ev.analysis}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
