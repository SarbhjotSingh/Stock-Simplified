/**
 * Pure mathematical functions for financial and Forex calculations.
 * Decoupled from UI to ensure fast, deterministic unit testability.
 */

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Calculate PIP difference between entry and current price.
 * For EUR/USD (pipSize = 0.0001): 1.0850 - 1.0800 = 50 pips.
 * For USD/JPY (pipSize = 0.01): 155.50 - 155.00 = 50 pips.
 */
export function calculatePipDifference(price1: number, price2: number, pipSize: number): number {
  if (pipSize <= 0) return 0;
  return Number(((price2 - price1) / pipSize).toFixed(1));
}

/**
 * Calculate margin requirement in USD.
 * Standard lot size = 100,000 currency units.
 * Margin = (Lot Size * Contract Size * Entry Price) / Leverage
 * For stocks: (Shares * Price) / Leverage
 */
export function calculateRequiredMargin(
  entryPrice: number,
  lotSize: number,
  leverage: number,
  isForex: boolean = true
): number {
  if (leverage <= 0 || lotSize <= 0 || entryPrice <= 0) return 0;
  const contractSize = isForex ? 100000 : 1;
  const nominalValue = lotSize * contractSize * entryPrice;
  return Number((nominalValue / leverage).toFixed(2));
}

/**
 * Calculate Unrealized / Realized P&L in USD.
 * For BUY: (currentPrice - entryPrice) * lotSize * contractSize
 * For SELL: (entryPrice - currentPrice) * lotSize * contractSize
 */
export function calculatePnL(
  side: 'BUY' | 'SELL',
  entryPrice: number,
  currentPrice: number,
  lotSize: number,
  isForex: boolean = true
): number {
  const contractSize = isForex ? 100000 : 1;
  const priceDiff = side === 'BUY' ? (currentPrice - entryPrice) : (entryPrice - currentPrice);
  return Number((priceDiff * lotSize * contractSize).toFixed(2));
}

/**
 * Fibonacci Retracement Levels.
 * Given a swing low and swing high, computes key retracement ratios:
 * 0% (High), 23.6%, 38.2%, 50%, 61.8% (Golden Ratio), 78.6%, 100% (Low).
 */
export interface FibLevel {
  ratio: number;
  label: string;
  price: number;
  color: string;
}

export function calculateFibonacciLevels(swingLow: number, swingHigh: number): FibLevel[] {
  const diff = swingHigh - swingLow;
  const ratios = [
    { ratio: 0.0, label: '0.0% (High)', color: '#94a3b8' },
    { ratio: 0.236, label: '23.6%', color: '#38bdf8' },
    { ratio: 0.382, label: '38.2%', color: '#4ade80' },
    { ratio: 0.5, label: '50.0%', color: '#facc15' },
    { ratio: 0.618, label: '61.8% (Golden)', color: '#fb923c' },
    { ratio: 0.786, label: '78.6%', color: '#c084fc' },
    { ratio: 1.0, label: '100.0% (Low)', color: '#f87171' },
  ];

  return ratios.map(r => ({
    ...r,
    price: Number((swingHigh - diff * r.ratio).toFixed(5)),
  }));
}

/**
 * Simple Moving Average (SMA).
 */
export function calculateSMA(data: number[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      sma.push(Number((sum / period).toFixed(5)));
    }
  }
  return sma;
}

/**
 * Exponential Moving Average (EMA).
 */
export function calculateEMA(data: number[], period: number): (number | null)[] {
  const ema: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ema.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += data[j];
      prevEma = sum / period;
      ema.push(Number(prevEma.toFixed(5)));
    } else {
      prevEma = data[i] * k + prevEma! * (1 - k);
      ema.push(Number(prevEma.toFixed(5)));
    }
  }
  return ema;
}

/**
 * Relative Strength Index (RSI - 14 period standard).
 */
export function calculateRSI(closes: number[], period: number = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  if (closes.length <= period) {
    return closes.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  // Initial average gain/loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // First period entries are null
  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(Number((100 - (100 / (1 + rs))).toFixed(2)));

  // Smoothed RSI for the rest
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const curRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const currentRsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + curRs));
    rsi.push(Number(currentRsi.toFixed(2)));
  }

  return rsi;
}

/**
 * Global Forex Market Sessions (in UTC hours).
 * - Sydney: 21:00 - 06:00 UTC
 * - Tokyo: 00:00 - 09:00 UTC
 * - London: 08:00 - 17:00 UTC
 * - New York: 13:00 - 22:00 UTC
 */
export interface MarketSession {
  name: string;
  city: string;
  startUTC: number;
  endUTC: number;
  isOpen: boolean;
  volatility: 'Low' | 'Moderate' | 'High' | 'Extreme';
  overlapWith?: string[];
}

export function getMarketSessions(utcHour: number): {
  sessions: MarketSession[];
  activeCount: number;
  isPeakOverlap: boolean; // London & New York (13:00 to 17:00 UTC)
} {
  const checkOpen = (start: number, end: number, hour: number) => {
    if (start < end) return hour >= start && hour < end;
    // Crosses midnight (e.g. Sydney 21:00 to 06:00)
    return hour >= start || hour < end;
  };

  const sydneyOpen = checkOpen(21, 6, utcHour);
  const tokyoOpen = checkOpen(0, 9, utcHour);
  const londonOpen = checkOpen(8, 17, utcHour);
  const newYorkOpen = checkOpen(13, 22, utcHour);

  const isPeakOverlap = londonOpen && newYorkOpen; // 13:00 to 17:00 UTC

  const sessions: MarketSession[] = [
    {
      name: 'Sydney Session',
      city: 'Sydney (Pacific)',
      startUTC: 21,
      endUTC: 6,
      isOpen: sydneyOpen,
      volatility: 'Moderate',
      overlapWith: tokyoOpen ? ['Tokyo'] : [],
    },
    {
      name: 'Tokyo Session',
      city: 'Tokyo (Asian)',
      startUTC: 0,
      endUTC: 9,
      isOpen: tokyoOpen,
      volatility: londonOpen ? 'High' : 'Moderate',
      overlapWith: londonOpen ? ['London'] : (sydneyOpen ? ['Sydney'] : []),
    },
    {
      name: 'London Session',
      city: 'London (European)',
      startUTC: 8,
      endUTC: 17,
      isOpen: londonOpen,
      volatility: isPeakOverlap ? 'Extreme' : 'High',
      overlapWith: newYorkOpen ? ['New York'] : (tokyoOpen ? ['Tokyo'] : []),
    },
    {
      name: 'New York Session',
      city: 'New York (US)',
      startUTC: 13,
      endUTC: 22,
      isOpen: newYorkOpen,
      volatility: isPeakOverlap ? 'Extreme' : 'High',
      overlapWith: londonOpen ? ['London'] : [],
    },
  ];

  const activeCount = sessions.filter(s => s.isOpen).length;

  return { sessions, activeCount, isPeakOverlap };
}
