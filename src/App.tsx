import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { WelcomePathwayModal } from './components/WelcomePathwayModal';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';
import { BeginnerPollModal } from './components/beginner/BeginnerPollModal';
import { InteractiveGuidedTour } from './components/beginner/InteractiveGuidedTour';
import { EducationalHub } from './components/beginner/EducationalHub';
import { AdvancedTradingWorkspace } from './components/chart/AdvancedTradingWorkspace';
import { EconomicCalendarWidget } from './components/calendar/EconomicCalendarWidget';
import { DeepAnalysisModal } from './components/ai/DeepAnalysisModal';
import { LiveVoiceCoachModal } from './components/ai/LiveVoiceCoachModal';
import { AchievementsModal } from './components/badges/AchievementsModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import {
  Asset,
  UserProfile,
  AccountState,
  Position,
  TradeHistoryItem,
  OnboardingPoll,
  OrderSide,
  OrderType,
  AudioChapter,
} from './types/market';
import { TourStepItem, SubscriptionPlan } from './types/admin';
import { Language } from './i18n/translations';
import { AUDIO_CHAPTERS } from './data/educationalContent';
import { DEFAULT_TOUR_STEPS } from './data/defaultTourData';
import { speechAgent } from './utils/speechAgent';

export default function App() {
  // Dedicated route for hidden admin access: /admin-login or #/admin-login
  const [currentRoute, setCurrentRoute] = useState<'app' | 'admin-login'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin-login' || hash === '#/admin-login') {
        return 'admin-login';
      }
    }
    return 'app';
  });

  // Language & i18n
  const [language, setLanguage] = useState<Language>('en');

  // User & Auth State
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user_alex',
    name: 'Alex Mercer',
    email: 'alex@stocksimplified.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pathway: null,
    onboardingCompleted: false,
    pollCompleted: false,
    badges: ['welcome_aboard'],
  });

  // Pathway selection
  const [currentPathway, setCurrentPathway] = useState<'beginner' | 'advanced' | null>(null);
  const [isInTour, setIsInTour] = useState(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVoiceCoachOpen, setIsVoiceCoachOpen] = useState(false);
  const [isDeepAnalysisOpen, setIsDeepAnalysisOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);

  // Dynamic CMS content managed by Admin
  const [podcasts, setPodcasts] = useState<AudioChapter[]>(AUDIO_CHAPTERS);
  const [tourSteps, setTourSteps] = useState<TourStepItem[]>(DEFAULT_TOUR_STEPS);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Market Assets
  const [assets, setAssets] = useState<Asset[]>([
    {
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      type: 'forex',
      basePrice: 1.085,
      pipSize: 0.0001,
      category: 'Major Currency',
      description: 'The most traded currency pair globally, driven by ECB and US Federal Reserve policy.',
    },
    {
      symbol: 'GBP/USD',
      name: 'British Pound / US Dollar',
      type: 'forex',
      basePrice: 1.294,
      pipSize: 0.0001,
      category: 'Major Currency ("Cable")',
      description: 'Known as "Cable", famous for swift volatility during London-New York overlap.',
    },
    {
      symbol: 'USD/JPY',
      name: 'US Dollar / Japanese Yen',
      type: 'forex',
      basePrice: 154.2,
      pipSize: 0.01,
      category: 'Major Currency',
      description: 'Highly sensitive to US Treasury yields and Bank of Japan monetary intervention.',
    },
    {
      symbol: 'AUD/USD',
      name: 'Australian Dollar / US Dollar',
      type: 'forex',
      basePrice: 0.655,
      pipSize: 0.0001,
      category: 'Commodity Currency',
      description: 'Commodity currency closely tied to global metals, energy, and Asian demand.',
    },
    {
      symbol: 'USD/CAD',
      name: 'US Dollar / Canadian Dollar',
      type: 'forex',
      basePrice: 1.391,
      pipSize: 0.0001,
      category: 'Commodity Currency ("Loonie")',
      description: 'The "Loonie", tightly correlated with Crude Oil futures and North American trade.',
    },
    {
      symbol: 'GBP/JPY',
      name: 'British Pound / Japanese Yen',
      type: 'forex',
      basePrice: 199.5,
      pipSize: 0.01,
      category: 'Cross Currency ("The Beast")',
      description: 'Revered as "The Dragon/Beast" for huge daily pip ranges and rapid momentum swings.',
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      basePrice: 224.5,
      pipSize: 0.01,
      category: 'US Mega-Cap Tech',
      description: 'Global consumer electronics titan with resilient cash flow and product ecosystem.',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      type: 'stock',
      basePrice: 138.8,
      pipSize: 0.01,
      category: 'US AI & Semiconductor',
      description: 'Leading producer of GPU hardware powering artificial intelligence breakthroughs.',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      type: 'stock',
      basePrice: 252.1,
      pipSize: 0.01,
      category: 'US EV & Clean Tech',
      description: 'High-beta electric vehicle and energy robotics manufacturer.',
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      type: 'stock',
      basePrice: 2740.0,
      pipSize: 0.05,
      category: 'Indian Blue Chip',
      description: 'India\'s heavyweight conglomerate spanning energy, retail, and Jio telecom.',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      type: 'stock',
      basePrice: 3950.0,
      pipSize: 0.05,
      category: 'Indian IT Giant',
      description: 'Premier global IT services and digital transformation multinational.',
    },
  ]);

  const [currentAsset, setCurrentAsset] = useState<Asset>(assets[0]);

  // Virtual Account State
  const [account, setAccount] = useState<AccountState>({
    balance: 100000.0,
    equity: 100000.0,
    freeMargin: 100000.0,
    marginLevel: 999.0,
    usedMargin: 0,
    realizedPnL: 0,
    unrealizedPnL: 0,
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['welcome_aboard']);

  // Listen for URL route changes (e.g. /admin-login or #/admin-login)
  useEffect(() => {
    const handleLocationChange = () => {
      const isPathAdmin = window.location.pathname === '/admin-login';
      const isHashAdmin = window.location.hash === '#/admin-login';
      if (isPathAdmin || isHashAdmin) {
        setCurrentRoute('admin-login');
      } else {
        setCurrentRoute('app');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch initial assets and portfolio state from backend
  useEffect(() => {
    async function init() {
      try {
        const assetsRes = await fetch('/api/market/assets');
        const assetsData = await assetsRes.json();
        if (assetsData.assets) {
          setAssets(assetsData.assets);
        }

        const portRes = await fetch('/api/trading/portfolio');
        const portData = await portRes.json();
        if (portData.account) {
          setAccount(portData.account);
          setPositions(portData.positions || []);
          setTradeHistory(portData.history || []);
          if (portData.badges) setUnlockedBadges(portData.badges);
        }
      } catch (err) {
        console.warn('Initial data load fallback:', err);
      }
    }
    init();

    // Handle ?autostart=1 or ?pathway= query parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('pathway') === 'advanced') {
        setCurrentPathway('advanced');
        setIsWelcomeOpen(false);
      } else if (params.get('pathway') === 'beginner') {
        setCurrentPathway('beginner');
        setIsWelcomeOpen(false);
      } else if (window.location.pathname !== '/admin-login' && window.location.hash !== '#/admin-login') {
        // Show Welcome Pathway modal on fresh arrival
        setIsWelcomeOpen(true);
      }
    }
  }, []);

  // Periodic poll to update portfolio equity and PnL
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/trading/portfolio');
        const data = await res.json();
        if (data.account) {
          setAccount(data.account);
          setPositions(data.positions || []);
        }
      } catch {
        // quiet fallback
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Badge unlock handler
  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      if (user) {
        setUser({ ...user, badges: [...user.badges, badgeId] });
      }
    }
  };

  // Onboarding Pathway Selections
  const handleSelectOptionA = () => {
    setIsWelcomeOpen(false);
    // As per user specification: If Option A is selected, trigger subscription popup before educational tour
    setIsSubscriptionOpen(true);
  };

  const handleSubscriptionSuccess = (plan: SubscriptionPlan) => {
    setIsSubscriptionOpen(false);
    setCurrentPathway('beginner');
    setIsPollOpen(true);
  };

  const handleSelectOptionB = () => {
    setIsWelcomeOpen(false);
    setCurrentPathway('advanced');
  };

  const handleSubmitPoll = (poll: OnboardingPoll) => {
    setIsPollOpen(false);
    handleUnlockBadge('pathfinder');
    // Start interactive guided tour with bare chart and progressive reveal
    setIsInTour(true);
  };

  const handleCompleteTour = () => {
    setIsInTour(false);
    handleUnlockBadge('tour_graduate');
  };

  // Paper Trading Actions
  const handleExecuteOrder = async (order: {
    symbol: string;
    side: OrderSide;
    orderType: OrderType;
    lotSize: number;
    leverage: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    try {
      const res = await fetch('/api/trading/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'demo_user',
          ...order,
        }),
      });
      const data = await res.json();
      if (data.position) {
        setPositions((prev) => [...prev, data.position]);
        handleUnlockBadge('first_trade');
      }
    } catch (e) {
      console.error('Order submission error:', e);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      const res = await fetch('/api/trading/close-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'demo_user',
          positionId,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPositions((prev) => prev.filter((p) => p.id !== positionId));
        if (data.trade) {
          setTradeHistory((prev) => [data.trade, ...prev]);
        }
        if (data.realizedPnL > 0) {
          handleUnlockBadge('profit_maker');
        }
      }
    } catch (e) {
      console.error('Close position error:', e);
    }
  };

  const handleResetBalance = async () => {
    try {
      await fetch('/api/trading/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'demo_user' }),
      });
      setAccount({
        balance: 100000.0,
        equity: 100000.0,
        freeMargin: 100000.0,
        marginLevel: 999.0,
        usedMargin: 0,
        realizedPnL: 0,
        unrealizedPnL: 0,
      });
      setPositions([]);
      setTradeHistory([]);
    } catch (e) {
      console.error('Reset balance error:', e);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechAgent.setMuted(next);
  };

  // If user navigated to /admin-login or #/admin-login, render the dedicated Admin Portal
  if (currentRoute === 'admin-login') {
    return (
      <AdminLoginPage
        onBackToApp={() => {
          if (window.history.pushState) {
            window.history.pushState(null, '', '/');
          }
          window.location.hash = '';
          setCurrentRoute('app');
        }}
        podcasts={podcasts}
        onUpdatePodcasts={setPodcasts}
        tourSteps={tourSteps}
        onUpdateTourSteps={setTourSteps}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentPathway={currentPathway}
        onSelectPathway={(pw) => {
          setCurrentPathway(pw);
          setIsInTour(false);
        }}
        account={account}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetBalance={handleResetBalance}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenVoiceCoach={() => setIsVoiceCoachOpen(true)}
        onOpenDeepAnalysis={() => setIsDeepAnalysisOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenBadges={() => setIsBadgesOpen(true)}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col">
        {isInTour ? (
          <InteractiveGuidedTour
            onCompleteTour={handleCompleteTour}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            customSteps={tourSteps}
          />
        ) : currentPathway === 'beginner' ? (
          <EducationalHub
            onUnlockBadge={handleUnlockBadge}
            unlockedBadges={unlockedBadges}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            customPodcasts={podcasts}
          />
        ) : (
          <AdvancedTradingWorkspace
            assets={assets}
            currentAsset={currentAsset}
            onSelectAsset={setCurrentAsset}
            account={account}
            positions={positions}
            tradeHistory={tradeHistory}
            onExecuteOrder={handleExecuteOrder}
            onClosePosition={handleClosePosition}
            onOpenDeepAnalysis={() => setIsDeepAnalysisOpen(true)}
            onUnlockBadge={handleUnlockBadge}
          />
        )}
      </main>

      {/* Discreet footer with subtle direct portal link */}
      <footer className="py-2.5 px-6 border-t border-slate-900 bg-slate-950/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>Stock Simplified © · Forex & Stock Hybrid Education and Paper Trading Simulator</div>
        <div className="flex items-center gap-3">
          <span>Real-Time Market Microstructure</span>
          <span className="text-slate-800">•</span>
          <a
            href="#/admin-login"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#/admin-login';
              setCurrentRoute('admin-login');
            }}
            className="text-slate-700 hover:text-slate-400 transition-colors cursor-pointer"
            title="Dedicated Admin Access (/admin-login)"
          >
            System Portal (/admin-login)
          </a>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (!currentPathway) {
            setIsWelcomeOpen(true);
          }
        }}
        initialUser={user}
      />

      <WelcomePathwayModal
        isOpen={isWelcomeOpen}
        onSelectOptionA={handleSelectOptionA}
        onSelectOptionB={handleSelectOptionB}
        userName={user?.name}
        language={language}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        language={language}
      />

      <BeginnerPollModal
        isOpen={isPollOpen}
        onSubmitPoll={handleSubmitPoll}
        language={language}
      />

      <EconomicCalendarWidget
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <DeepAnalysisModal
        isOpen={isDeepAnalysisOpen}
        onClose={() => setIsDeepAnalysisOpen(false)}
        asset={currentAsset}
      />

      <LiveVoiceCoachModal
        isOpen={isVoiceCoachOpen}
        onClose={() => setIsVoiceCoachOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <AchievementsModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        unlockedBadgeIds={unlockedBadges}
      />
    </div>
  );
}
