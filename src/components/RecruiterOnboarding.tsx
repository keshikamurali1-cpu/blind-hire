import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Building, 
  User, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';
import { UserSession } from '../types';

interface RecruiterOnboardingProps {
  user: UserSession;
  onComplete: (updatedUser: UserSession) => void;
}

export const RecruiterOnboarding: React.FC<RecruiterOnboardingProps> = ({
  user,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(user.name || '');
  const [organization, setOrganization] = useState(user.organization || '');
  const [roleTitle, setRoleTitle] = useState(user.jobTitle || '');
  const [usageIntent, setUsageIntent] = useState<string>('Verify technical skills');

  const intentOptions = [
    'Screen candidates',
    'Verify technical skills',
    'Create job assessments',
    'Evaluate applicants',
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setCurrentStep(2);
    }
  };

  const handleStep2Submit = () => {
    setCurrentStep(3);
  };

  const handleFinalFinish = () => {
    onComplete({
      ...user,
      name,
      organization: organization || 'Tech Recruiters Co.',
      jobTitle: roleTitle || 'Talent Acquisition Partner',
      usageIntent,
      onboardingComplete: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header with Progress Indicator */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">BlindHire Setup</span>
          </div>

          {/* Stepped Progress Indicator */}
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 1 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
              1 Profile
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 2 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
              2 Preferences
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep === 3 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
              3 Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Tell us about yourself
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Help us personalize your candidate evaluation workspace.
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
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Technologies"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Talent Acquisition Partner"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
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
                  How do you plan to use BlindHire?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select your primary objective to optimize your evaluation workflows.
                </p>
              </div>

              <div className="space-y-2.5">
                {intentOptions.map((opt) => {
                  const isSelected = usageIntent === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setUsageIntent(opt)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-xs sm:text-sm">{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
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
                  onClick={handleStep2Submit}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-2"
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
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  You're ready to evaluate skills.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  BlindHire will help you create job-specific evaluations, anonymize personal signals, and build evidence-based candidate profiles.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-left text-xs space-y-2 text-slate-700">
                <div className="flex items-center space-x-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Setup Complete</span>
                </div>
                <p className="text-slate-600">
                  Account: <strong>{name}</strong> ({organization})
                </p>
                <p className="text-slate-600">
                  Primary goal: <strong>{usageIntent}</strong>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinalFinish}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Go to Recruiter Workspace</span>
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
