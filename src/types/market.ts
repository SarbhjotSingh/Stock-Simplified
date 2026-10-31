export type MarketType = 'forex' | 'stock';

export interface Asset {
  symbol: string;
  name: string;
  type: MarketType;
  basePrice: number;
  pipSize: number; // e.g. 0.0001 for EUR/USD, 0.01 for USD/JPY, 0.01 for Stocks
  category: string;
  description: string;
}

export interface Candle {
  time: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL';

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  entryPrice: number;
  currentPrice: number;
  lotSize: number; // in standard lots (100,000 units for forex) or shares for stocks
  leverage: number; // e.g. 100 for 1:100
  marginUsed: number;
  stopLoss?: number;
  takeProfit?: number;
  unrealizedPnL: number;
  openTime: number;
}

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  side: OrderSide;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  realizedPnL: number;
  openTime: number;
  closeTime: number;
  reason: 'MANUAL' | 'TAKE_PROFIT' | 'STOP_LOSS';
}

export interface AccountState {
  balance: number;
  equity: number;
  freeMargin: number;
  marginLevel: number;
  usedMargin: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  currency: string;
  country: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string; // e.g. '13:30 UTC'
  actual?: string;
  forecast: string;
  previous: string;
  analysis: string;
}

export interface AudioChapter {
  id: string;
  title: string;
  duration: string;
  description: string;
  keyPoints: string[];
  transcript: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'beginner' | 'trading' | 'analysis';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface OnboardingPoll {
  selectedMarket: 'forex' | 'indian_stock';
  referralSource: string;
  experienceLevel?: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  pathway: 'beginner' | 'advanced' | null;
  onboardingCompleted: boolean;
  pollCompleted: boolean;
  pollData?: OnboardingPoll;
  badges: string[]; // badge ids
}
