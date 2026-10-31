import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { verifyAdminCredentials, SEEDED_ADMIN_EMAIL, SEEDED_ADMIN_PASSWORD } from '../../utils/adminTourMath';
import { AudioChapter } from '../../types/market';
import { TourStepItem } from '../../types/admin';
import { AdminDashboardModal } from './AdminDashboardModal';

interface AdminLoginPageProps {
  onBackToApp: () => void;
  podcasts: AudioChapter[];
  onUpdatePodcasts: (podcasts: AudioChapter[]) => void;
  tourSteps: TourStepItem[];
  onUpdateTourSteps: (steps: TourStepItem[]) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onBackToApp,
  podcasts,
  onUpdatePodcasts,
  tourSteps,
  onUpdateTourSteps,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickFill = () => {
    setEmail(SEEDED_ADMIN_EMAIL);
    setPassword(SEEDED_ADMIN_PASSWORD);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Call server API and fallback to local verification
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setIsAuthenticated(true);
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Local check fallback
    }

    if (verifyAdminCredentials(email, password)) {
      setIsAuthenticated(true);
    } else {
      setError('Invalid administrative credentials. Use seeded credentials: admin@stocksimplified.com / AdminPass123!');
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // If authenticated, display full administrative CMS
  if (isAuthenticated) {
    return (
      <AdminDashboardModal
        isOpen={true}
        onClose={onBackToApp}
        podcasts={podcasts}
        onUpdatePodcasts={onUpdatePodcasts}
        tourSteps={tourSteps}
        onUpdateTourSteps={onUpdateTourSteps}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stock Simplified
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            Hidden Route: /admin-login
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Content management access for Guided Tour voice sequences and Educational Podcast episodes.
          </p>
        </div>

        {/* Quick Fill Credentials Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
          <div className="text-xs">
            <div className="font-semibold text-cyan-300">Seeded Admin Account:</div>
            <div className="font-mono text-[11px] text-slate-300 mt-0.5">
              admin@stocksimplified.com • AdminPass123!
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stocksimplified.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          Stock Simplified Enterprise CMS • Role-Based Access Control
        </div>
      </div>
    </div>
  );
};
