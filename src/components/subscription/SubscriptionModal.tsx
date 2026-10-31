import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionPlan, PaymentMethod } from '../../types/admin';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { isValidUpiId, isValidCardNumber } from '../../utils/adminTourMath';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: SubscriptionPlan) => void;
  language: Language;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free_trial',
    name: '7-Day Free Trial',
    tagline: 'Start learning risk-free today',
    priceINR: 0,
    priceUSD: 0,
    period: 'month',
    badge: 'Zero Risk',
    features: [
      'Interactive Voice Guided Tour',
      'Forex Basics & PIP calculations',
      '$100,000 Paper Trading balance',
      'Live Session Overlap Clock',
    ],
  },
  {
    id: 'pro_masterclass',
    name: 'Pro Trader Masterclass',
    tagline: 'Most chosen by aspiring traders',
    priceINR: 999,
    priceUSD: 14,
    period: 'month',
    badge: 'Most Popular',
    popular: true,
    features: [
      'All 4 Audio Podcast Chapters & Transcripts',
      'Unlimited Voice Agent Interactive Tour',
      'Advanced TradingView Indicators & Fibonacci',
      'Live Economic Calendar volatility alerts',
      'Gemini 4 Argon AI Quant Reasoning',
    ],
  },
  {
    id: 'annual_vip',
    name: 'Annual VIP Lifetime',
    tagline: 'Save 60% with full year access',
    priceINR: 4999,
    priceUSD: 59,
    period: 'year',
    badge: 'Best Value',
    features: [
      'Everything in Pro Masterclass',
      'NSE / BSE Indian Stock Module Early Access',
      'Priority High-Thinking Model Quota',
      'Exclusive Trader Achievement Badges',
      'Direct Discord Community Access',
    ],
  },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(PLANS[1]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('trader@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('Alex Mercer');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onSuccess(selectedPlan);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {t.subscriptionTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  SIMULATOR CHECKOUT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{t.subscriptionSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">{t.paymentSuccess}</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Your {selectedPlan.name} membership has been activated. Transitioning to your interactive guided tour...
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {/* Plan selection grid */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                1. Select Membership Tier
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      {plan.badge && (
                        <span
                          className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            plan.popular
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}

                      <div>
                        <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-emerald-400 font-mono">
                            {plan.priceINR === 0 ? 'FREE' : `₹${plan.priceINR.toLocaleString('en-IN')}`}
                          </span>
                          {plan.priceINR > 0 && (
                            <span className="text-[10px] text-slate-400">
                              / {plan.period} (~${plan.priceUSD})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{plan.tagline}</p>
                      </div>

                      <ul className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector (Frontend-only mockup) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                2. Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2.5 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Method Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">Pay via UPI Apps (GPay, PhonePe, Paytm, BHIM)</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Zero Transaction Fees</span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Enter UPI VPA / Handle
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or name@okaxis"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Cardholder</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2 text-xs">
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Choose Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Total & Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL Mock Secured • No Real Charge</span>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Processing Mock Transaction...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedPlan.priceINR === 0
                        ? 'Activate Free Trial'
                        : `Pay ₹${selectedPlan.priceINR.toLocaleString('en-IN')} & Begin Tour`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
