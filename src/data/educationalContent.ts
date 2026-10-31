import { AudioChapter, AchievementBadge } from '../types/market';

export const AUDIO_CHAPTERS: AudioChapter[] = [
  {
    id: 'chap-1',
    title: 'Forex 101: What is a Currency Pair?',
    duration: '4:15 min',
    description: 'Learn how exchange rates work, the Base vs Quote currency dynamics, and why currencies are always traded in pairs.',
    keyPoints: [
      'The first currency is the Base currency; the second is the Quote currency.',
      'Buying EUR/USD means you are buying Euros and selling US Dollars simultaneously.',
      'Exchange rates represent how much Quote currency is required to purchase one unit of Base currency.',
      'The Forex market trades over $7.5 Trillion daily with 24/5 global liquidity.',
    ],
    transcript: `Welcome to Stock Simplified Forex 101. When you trade Forex, you are participating in the largest, most liquid financial marketplace on Earth. Unlike buying shares in a single company, Forex transactions always occur in pairs. 

Take EUR/USD for example. The Euro is the Base currency, and the US Dollar is the Quote currency. If the price is 1.0850, it means one Euro is currently worth 1 dollar and 8.5 cents. When you believe the European economy will outperform the US, you go Long or Buy. When you expect the US Dollar to strengthen, you Sell or Short. 

Because banks, hedge funds, and multinational corporations trade currencies around the clock, you enjoy continuous opportunities from Monday morning in Sydney to Friday evening in New York. Remember: always define your risk before entering any position!`,
  },
  {
    id: 'chap-2',
    title: 'PIPs, Lots & Leverage Demystified',
    duration: '5:30 min',
    description: 'Understand the mathematical building blocks of Forex trading: PIP calculations, Micro vs Standard lots, and how leverage impacts margin.',
    keyPoints: [
      'PIP stands for "Percentage in Point" — typically the 4th decimal (0.0001), or 2nd decimal for JPY pairs (0.01).',
      '1 Standard Lot = 100,000 units. 1 Pip on 1.0 lot of EUR/USD = $10 USD.',
      'Leverage amplifies purchasing power, but proportionally multiplies both gains and losses.',
      'A 1:100 leverage allows you to control a $100,000 position with just $1,000 of account margin.',
    ],
    transcript: `In this chapter, we unpack the mathematical foundations of Forex: PIPs, Lots, and Leverage. 

PIP stands for "Percentage in Point". For most currency pairs, a PIP is the fourth decimal place—0.0001. If EUR/USD rises from 1.0850 to 1.0860, that is a 10 PIP move. However, for Japanese Yen pairs like USD/JPY, a pip is the second decimal place, 0.01.

Now, how does a pip translate into real money? That depends on your Lot Size. In Forex, 1 Standard Lot represents 100,000 units of currency. At 1 standard lot on EUR/USD, each pip is worth approximately $10. A Mini Lot (0.10) makes each pip worth $1, and a Micro Lot (0.01) makes each pip worth 10 cents.

Finally, Leverage allows you to open large positions with small collateral called Margin. With 1:100 leverage, a $100,000 trade requires only $1,000 in your account. While leverage provides great capital efficiency, unmanaged leverage is the number one cause of beginner account blowouts. Always trade with a calculated stop loss!`,
  },
  {
    id: 'chap-3',
    title: 'Reading Candlestick Patterns like a Pro',
    duration: '6:10 min',
    description: 'Master the visual anatomy of Japanese candlesticks: Open, High, Low, Close, Hammer rejections, and Bullish/Bearish Engulfing signals.',
    keyPoints: [
      'Every candlestick tells a story of the battle between buyers (bulls) and sellers (bears).',
      'Long upper wicks indicate buyer exhaustion and seller rejection at high prices.',
      'A Hammer candle at key support signals a potential bullish reversal.',
      'A Bearish Engulfing candle indicates sellers completely overwhelmed previous buyer momentum.',
    ],
    transcript: `Japanese candlesticks are the universal language of financial charts. Each candle encapsulates four critical data points over your chosen timeframe: Open, High, Low, and Close.

The colored rectangle is the Real Body. Green or white signifies the price closed higher than it opened—bulls were in control. Red or black means price closed lower—bears dominated. The thin lines protruding above and below are known as Wicks or Shadows, illustrating the highest and lowest prices reached during that session.

When you see a long lower wick with a small body near the top of the candle—known as a Hammer—it demonstrates that sellers tried to push prices down, but aggressive buyers stepped in, completely rejecting lower prices. When formed at a major support level or 61.8% Fibonacci retracement, this is a high-probability reversal signal. Always look for confluence with volume and moving averages!`,
  },
  {
    id: 'chap-4',
    title: 'The Golden Rule: 1:2 Risk-to-Reward',
    duration: '4:45 min',
    description: 'Why you can lose 60% of your trades and still be consistently profitable by mastering asymmetric risk management.',
    keyPoints: [
      'Never risk more than 1% to 2% of your total account balance on a single trade.',
      'Always aim for at least a 1:2 or 1:3 Risk-to-Reward ratio.',
      'At 1:2 R:R, a trader winning only 40% of trades remains net profitable.',
      'Set your Stop Loss based on chart structure, not arbitrary dollar amounts.',
    ],
    transcript: `Here is the biggest secret in professional trading: successful trading is not about having a 90% win rate. It is about asymmetric Risk-to-Reward.

Imagine you risk $100 on every trade, but your target is $200. This is a 1 to 2 Risk-to-Reward ratio. If you take 10 trades and lose 6 of them, you lose $600. But on your 4 winning trades, you gain $800. Result? You finish with a net profit of $200 despite being wrong 60% of the time!

Always place your Stop Loss at a technical invalidation level—just below a recent swing low or key support. Then calculate your position size so that if stopped out, you lose no more than 1% of your total equity. Risk management keeps you in the game long enough for compounding to work its magic.`,
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'welcome_aboard',
    title: 'Welcome Aboard',
    description: 'Registered on Stock Simplified and initiated your trading journey.',
    icon: 'Compass',
    category: 'beginner',
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'pathfinder',
    title: 'Curriculum Pathfinder',
    description: 'Completed the initial onboarding poll and selected the Forex track.',
    icon: 'MapPin',
    category: 'beginner',
    unlocked: false,
  },
  {
    id: 'tour_graduate',
    title: 'Interactive Tour Graduate',
    description: 'Completed the progressive voice-guided tour of the charting interface.',
    icon: 'GraduationCap',
    category: 'beginner',
    unlocked: false,
  },
  {
    id: 'podcast_scholar',
    title: 'Audio Scholar',
    description: 'Listened to a Stock Simplified educational podcast chapter.',
    icon: 'Headphones',
    category: 'beginner',
    unlocked: false,
  },
  {
    id: 'first_trade',
    title: 'Paper Trader Bronze',
    description: 'Executed your first virtual simulated market or limit order.',
    icon: 'TrendingUp',
    category: 'trading',
    unlocked: false,
  },
  {
    id: 'profit_maker',
    title: 'Green Day Trader',
    description: 'Closed an open trade with positive realized virtual profit.',
    icon: 'DollarSign',
    category: 'trading',
    unlocked: false,
  },
  {
    id: 'session_master',
    title: 'Global Session Master',
    description: 'Explored the London-New York peak volatility overlap clock.',
    icon: 'Globe',
    category: 'analysis',
    unlocked: false,
  },
  {
    id: 'deep_analyst',
    title: 'Quant AI Strategist',
    description: 'Generated institutional reasoning using the Gemini 4 Deep Analyst.',
    icon: 'Brain',
    category: 'analysis',
    unlocked: false,
  },
];
