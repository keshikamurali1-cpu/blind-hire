import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Award, 
  Lock 
} from 'lucide-react';
import { UserSession } from '../types';

interface CandidateOnboardingProps {
  user: UserSession;
  onComplete: (updatedUser: UserSession) => void;
}

export const CandidateOnboarding: React.FC<CandidateOnboardingProps> = ({
  user,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(user.name || '');
  const [primaryFocus, setPrimaryFocus] = useState('Full Stack / Backend');

  const focusOptions = [
    'Full Stack / Backend',
    'Frontend Engineering',
    'Data Engineering / SQL',
    'Cloud / Systems Engineering',
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setCurrentStep(2);
  };

  const handleFinalFinish = () => {
    onComplete({
      ...user,
      name,
      jobTitle: primaryFocus,
      onboardingComplete: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">BlindHire Candidate Setup</span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 1 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
              1 Profile
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 2 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
              2 Focus
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 3 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
              3 Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Center Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome to BlindHire
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Where you get evaluated on what you can build, not where you studied.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                  <span className="text-[11px] text-slate-400 block pt-1">
                    🔒 Notice: Your name is never revealed to recruiters during initial screening.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  What is your primary focus?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select your specialty so we can tailor skill challenges.
                </p>
              </div>

              <div className="space-y-2.5">
                {focusOptions.map((opt) => {
                  const isSelected = primaryFocus === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPrimaryFocus(opt)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  You're ready to demonstrate skills.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  In BlindHire, recruiters evaluate your verified code and query evidence. Personal signals are masked to guarantee unbiased review.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-left text-xs space-y-2 text-slate-700">
                <div className="flex items-center space-x-2 font-bold text-slate-900">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Demographic Privacy Active</span>
                </div>
                <p className="text-slate-600">
                  You will be identified to reviewers solely as an anonymous candidate (e.g. Candidate 014) until hiring managers request an on-site interview.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalFinish}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Go to Candidate Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
