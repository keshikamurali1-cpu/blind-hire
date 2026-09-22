import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Lock, 
  SlidersHorizontal 
} from 'lucide-react';

interface SettingsScreenProps {
  onResetSampleData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onResetSampleData,
}) => {
  const [maskNames, setMaskNames] = useState(true);
  const [maskPhotos, setMaskPhotos] = useState(true);
  const [maskGender, setMaskGender] = useState(true);
  const [maskInstitutions, setMaskInstitutions] = useState(true);
  const [maskContact, setMaskContact] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    onResetSampleData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings & Protocols
        </h1>
        <p className="text-sm text-slate-600">
          Configure anti-bias masking protocols, AI verification rules, and demonstration data.
        </p>
      </div>

      {/* Anonymization Rules Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Anti-Bias Demographic Redaction
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Mask Legal Names & Identity
              </span>
              <span className="text-xs text-slate-500">
                Replace candidate names with standardized labels (e.g. Candidate 01)
              </span>
            </div>
            <input
              type="checkbox"
              checked={maskNames}
              onChange={(e) => setMaskNames(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Strip Photos & Demographics
              </span>
              <span className="text-xs text-slate-500">
                Prevent visual and demographic bias from entering initial screenings
              </span>
            </div>
            <input
              type="checkbox"
              checked={maskPhotos}
              onChange={(e) => setMaskPhotos(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Anonymize University Prestige
              </span>
              <span className="text-xs text-slate-500">
                Normalize institutional names to degree tier (e.g. B.Tech Computer Science)
              </span>
            </div>
            <input
              type="checkbox"
              checked={maskInstitutions}
              onChange={(e) => setMaskInstitutions(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Suppress Contact Details & Location
              </span>
              <span className="text-xs text-slate-500">
                Hide personal email, phone numbers, and physical addresses
              </span>
            </div>
            <input
              type="checkbox"
              checked={maskContact}
              onChange={(e) => setMaskContact(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            AI Engine Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium block">Active Intelligence Model</span>
            <span className="text-sm font-bold text-slate-900 block">Gemini 2.5 Flash</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Online & Responsive
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium block">Auditing & Explainability</span>
            <span className="text-sm font-bold text-slate-900 block">Strict Grounding</span>
            <span className="text-[11px] text-slate-600">Requires line-by-line source citations</span>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Demo & Sample Data Reset
        </h2>
        <p className="text-xs text-slate-600">
          Reset all evaluations, candidates, and verification challenge submissions back to clean demonstration defaults.
        </p>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{resetSuccess ? 'Reset Complete ✓' : 'Reset to Default Sample Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
