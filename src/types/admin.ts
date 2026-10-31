import { AudioChapter } from './market';

export interface TourStepItem {
  id: number;
  title: string;
  voiceScript: string;
  voiceScripts?: {
    en: string;
    hi: string;
    pa: string;
  };
  reveals: 'bare' | 'indicators' | 'drawing' | 'orders' | 'calendar' | 'complete';
  targetLabel: string;
  badgeUnlock?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceINR: number;
  priceUSD: number;
  period: 'month' | 'year' | 'lifetime';
  badge?: string;
  popular?: boolean;
  features: string[];
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
