import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface SignUpScreenProps {
  onSignUpSuccess: (user: UserSession) => void;
  onNavigateToSignIn: () => void;
  onBackToHome: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToSignIn,
  onBackToHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('recruiter');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role,
      onboardingComplete: false,
    };

    onSignUpSuccess(newUser);
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
          onClick={onNavigateToSignIn}
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          Sign In
        </button>
      </header>

      {/* Main Form Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create your BlindHire account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Start evaluating based on demonstrated skills, not keywords.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Role Selection: I am a... */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition cursor-pointer ${
                    role === 'recruiter'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Briefcase className={`w-4 h-4 ${role === 'recruiter' ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="text-xs sm:text-sm">Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition cursor-pointer ${
                    role === 'candidate'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <User className={`w-4 h-4 ${role === 'candidate' ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="text-xs sm:text-sm">Candidate</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Switch to Sign In */}
          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            Already have an account?{' '}
            <button
              onClick={onNavigateToSignIn}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
