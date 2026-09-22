import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  FileCheck2, 
  ChevronRight,
  EyeOff
} from 'lucide-react';

interface LandingPageProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onExploreSample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignInClick,
  onSignUpClick,
  onExploreSample,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">BlindHire</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSignInClick}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onSignUpClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center space-y-8">
        {/* Anti-Bias Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Evidence-Based Hiring Platform</span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            From Resume Claims to <br className="hidden sm:inline" />
            <span className="text-indigo-600">Verified Skill Evidence</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Evaluate candidates based on demonstrated skills and job-relevant evidence — not personal signals.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
          <button
            onClick={onSignUpClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSignInClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer"
          >
            Sign In
          </button>
        </div>

        {/* Explore Sample Evaluation Link */}
        <div className="pt-1">
          <button
            onClick={onExploreSample}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 group cursor-pointer"
          >
            <span>Explore Sample Evaluation</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left w-full pt-10">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <EyeOff className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Blind Candidate Profiles</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Personal signals (names, photos, gender markers, contact details, university pedigree) are suppressed before recruiter review.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Job-Specific Challenges</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Job descriptions are converted into 5-minute practical micro-tasks that test real execution rather than resume claims.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Explainable Evidence Profiles</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No black-box percentages. Candidates receive evidence coverage profiles showing exactly what they demonstrated.
            </p>
          </div>
        </div>

        {/* Two User Types Banner */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs text-left mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Two Dedicated Experiences
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Built for Both Hiring Teams and Applicants
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h4 className="font-bold text-slate-900">For Recruiters & HR</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Create evaluations, analyze job descriptions, mask candidate demographics, generate micro-tasks, and audit evidence side-by-side.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h4 className="font-bold text-slate-900">For Candidates</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Take focused 5-minute skill tasks, receive transparent feedback, and build a verified, portable <strong>Skill Evidence Passport</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">BlindHire</span>
            <span>•</span>
            <span>From Resume Claims to Verified Skill Evidence</span>
          </div>
          <button
            onClick={onExploreSample}
            className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Explore Sample Evaluation →
          </button>
        </div>
      </footer>
    </div>
  );
};
