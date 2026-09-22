import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Eye, 
  ShieldCheck, 
  X, 
  Check, 
  User, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';
import { Candidate } from '../types';

interface Step3BlindProfilesProps {
  candidates: Candidate[];
  onContinue: () => void;
  onBack: () => void;
}

export const Step3BlindProfiles: React.FC<Step3BlindProfilesProps> = ({
  candidates,
  onContinue,
  onBack,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Blind Profiles
        </h1>
        <p className="text-sm text-slate-600">
          Personal signals are hidden so evaluation can focus on job-relevant information.
        </p>
      </div>

      {/* Info Callout */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Anti-Bias Protection Active:</strong> Names, photos, gender markers, contact details, and institutional prestige markers have been systematically masked.
          </span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand, idx) => {
          const skillsList = cand.extractedSkills.map((s) => s.skill).slice(0, 4);

          return (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand)}
              className="group bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header with anonymous label and badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      {cand.anonymousLabel}
                    </h2>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-600" />
                    <span>Education</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium line-clamp-1">
                    {cand.anonymizedProfile.educationLevel}
                  </p>
                </div>

                {/* Relevant experience */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-600" />
                    <span>Relevant experience</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                    {cand.anonymizedProfile.relevantExperience[0] || `${cand.anonymizedProfile.relevantExperience.length} software projects`}
                  </p>
                </div>

                {/* Skills found */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Skills found
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-slate-600" />
                  <span>Personal signals hidden</span>
                </span>
                <span className="text-indigo-600 group-hover:text-indigo-700 font-semibold text-[11px] flex items-center gap-0.5">
                  Details <Eye className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Privacy Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {selectedCandidate.anonymousLabel.replace('Candidate ', '')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCandidate.anonymousLabel} — Blind Profile Audit
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Verifying personal signal suppression
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suppressed signals summary */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Suppressed Demographic Signals
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Legal name masked</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Photos & avatars removed</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gender / Pronouns masked</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Emails & phone hidden</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prestige school anonymized</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Location details hidden</span>
                  </div>
                </div>
              </div>

              {/* Verified profile highlights */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Evaluated Work Information
                </span>
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-slate-700">
                  <p>
                    <strong className="text-slate-900">Headline: </strong>
                    {selectedCandidate.anonymizedProfile.headline}
                  </p>
                  <p>
                    <strong className="text-slate-900">Normalized Education: </strong>
                    {selectedCandidate.anonymizedProfile.educationLevel}
                  </p>
                  <div>
                    <strong className="text-slate-900 block mb-1">Key Projects:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {selectedCandidate.anonymizedProfile.relevantExperience.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
        >
          <span>Review Skill Claims</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
