import React from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  FileText 
} from 'lucide-react';

interface PrivacyCenterScreenProps {
  onBack?: () => void;
}

export const PrivacyCenterScreen: React.FC<PrivacyCenterScreenProps> = ({
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy & Anti-Bias Center
        </h1>
        <p className="text-sm text-slate-600">
          How BlindHire separates job-relevant capabilities from demographic bias.
        </p>
      </div>

      {/* Core Philosophy Banner */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-6 text-xs sm:text-sm text-indigo-950 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-base text-indigo-900">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Core Privacy Principle: "Proof, Don't Profile"</span>
        </div>
        <p className="text-indigo-900 leading-relaxed font-normal">
          Traditional screening rewards prestige markers and keyword optimization while exposing candidates to subconscious pedigree and demographic bias. BlindHire removes all non-job-relevant demographic identifiers prior to recruiter review, ensuring candidates are evaluated solely on objective, demonstrated evidence.
        </p>
      </div>

      {/* Two Column Breakdown: What BlindHire Hides vs What BlindHire Uses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What BlindHire Hides */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">What BlindHire Hides</h2>
              <span className="text-[11px] text-slate-500">Demographic & personal signals</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Candidate Legal Names</strong>
                <span className="text-xs text-slate-500">Masked as standardized labels (e.g. Candidate 014)</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Photos & Visual Avatars</strong>
                <span className="text-xs text-slate-500">Stripped to eliminate visual appearance bias</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Gender Markers & Pronouns</strong>
                <span className="text-xs text-slate-500">Redacted from all resume summaries and project notes</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Institutional Pedigree & Elite School Names</strong>
                <span className="text-xs text-slate-500">Normalized to degree tier (e.g. B.Tech Computer Science)</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Personal Contact Info & Zip Codes</strong>
                <span className="text-xs text-slate-500">Email, phone, and neighborhood addresses hidden</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-red-500 font-bold">✕</span>
              <div>
                <strong className="text-slate-900 block">Age & Graduation Years</strong>
                <span className="text-xs text-slate-500">Dates suppressed to prevent generational ageism</span>
              </div>
            </li>
          </ul>
        </div>

        {/* What BlindHire Uses */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">What BlindHire Uses</h2>
              <span className="text-[11px] text-slate-500">Job-relevant capabilities & evidence</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start space-x-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <div>
                <strong className="text-slate-900 block">Technical Skills & Execution</strong>
                <span className="text-xs text-slate-500">Actual programming languages, tools, and query syntax</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <div>
                <strong className="text-slate-900 block">Relevant Project Experience</strong>
                <span className="text-xs text-slate-500">Functional systems built, scale handled, and real problems solved</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <div>
                <strong className="text-slate-900 block">Practical Challenge Results</strong>
                <span className="text-xs text-slate-500">5-minute micro-tasks evaluating algorithmic logic & edge cases</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <div>
                <strong className="text-slate-900 block">Explainable AI Evidence Logs</strong>
                <span className="text-xs text-slate-500">Line-by-line justification for why a candidate solution succeeds</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <div>
                <strong className="text-slate-900 block">Evidence Coverage Matrix</strong>
                <span className="text-xs text-slate-500">Factual demonstration status: Demonstrated, Partial, or Unverified</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
