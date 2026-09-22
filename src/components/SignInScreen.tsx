import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface SignInScreenProps {
  onSignInSuccess: (user: UserSession) => void;
  onNavigateToSignUp: () => void;
  onBackToHome: () => void;
  onExploreSample: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignInSuccess,
  onNavigateToSignUp,
  onBackToHome,
  onExploreSample,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Default to recruiter unless candidate email indicated
    const role: UserRole = email.toLowerCase().includes('candidate') ? 'candidate' : 'recruiter';
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const user: UserSession = {
      id: `usr-${Date.now()}`,
      name: formattedName || 'Alex Morgan',
      email: email.trim().toLowerCase(),
      role,
      onboardingComplete: true, // Returning user has completed onboarding
      organization: 'Acme Technologies',
      jobTitle: role === 'recruiter' ? 'Talent Acquisition Partner' : 'Software Engineer',
    };

    onSignInSuccess(user);
  };

  // Quick 1-click demo logins for judge convenience
  const handleQuickDemo = (role: UserRole) => {
    const user: UserSession = {
      id: `usr-demo-${role}`,
      name: role === 'recruiter' ? 'Sarah Jenkins' : 'Candidate 014',
      email: role === 'recruiter' ? 'sarah.jenkins@blindhire.demo' : 'candidate.014@blindhire.demo',
      role,
      onboardingComplete: true,
      organization: role === 'recruiter' ? 'Vertex Cloud Systems' : undefined,
      jobTitle: role === 'recruiter' ? 'Head of Engineering Talent' : 'Full Stack Developer',
    };
    onSignInSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Simple Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">BlindHire</span>
        </div>

        <button
          onClick={onNavigateToSignUp}
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          Create Account
        </button>
      </header>

      {/* Main Form Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in to BlindHire
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Access your evaluations, blind profiles, and verified evidence.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email in demo mode.')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 1-Click Demo Access for Judge / Fast Testing */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick 1-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="py-2 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer text-center"
              >
                Recruiter Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('candidate')}
                className="py-2 px-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer text-center"
              >
                Candidate Demo
              </button>
            </div>
          </div>

          {/* Switch to Sign Up */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
