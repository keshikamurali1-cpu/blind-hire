import React, { useState } from 'react';
import { 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Candidate, Evaluation } from '../types';

interface CandidatesViewProps {
  evaluation: Evaluation;
  onSelectCandidate: (candidate: Candidate) => void;
  onViewEvidence: (candidate: Candidate) => void;
  onOpenPrivacyAudit: (candidate: Candidate) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  evaluation,
  onSelectCandidate,
  onViewEvidence,
  onOpenPrivacyAudit,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    evaluation.candidates[0]?.id || ''
  );

  const activeCandidate = evaluation.candidates.find(c => c.id === selectedCandidateId) || evaluation.candidates[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Blind Evaluation Protocol Active</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Blind Candidate Profiles ({evaluation.candidates.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal identifiers (names, photos, universities, contact details) are suppressed. Evaluation is conducted strictly on technical evidence.
          </p>
        </div>

        <button
          onClick={() => activeCandidate && onOpenPrivacyAudit(activeCandidate)}
          className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Audit Suppressed Signals</span>
        </button>
      </div>

      {/* Grid: Candidate List on Left, Active Candidate Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidates Selection Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Blind Candidate
          </div>
          <div className="space-y-2">
            {evaluation.candidates.map((cand) => {
              const isSelected = cand.id === activeCandidate?.id;
              const completedCount = Object.keys(cand.submissions).length;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">
                      {cand.anonymousLabel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Blind ID
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {cand.anonymizedProfile.educationLevel}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{completedCount} challenges completed</span>
                    <span className="text-indigo-600 font-semibold flex items-center">
                      View details <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Candidate Dossier */}
        {activeCandidate && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-slate-900">
                    {activeCandidate.anonymousLabel}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Applied: {new Date(activeCandidate.appliedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeCandidate.anonymizedProfile.headline}
                </p>
              </div>

              <button
                onClick={() => onViewEvidence(activeCandidate)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Open Evidence Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Standardized Education & Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Degree Classification
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">
                  {activeCandidate.anonymizedProfile.educationLevel}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Specific university name masked to eliminate institution bias.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Programming Experience Scope
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">
                  {activeCandidate.anonymizedProfile.programmingExperience}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Derived from engineering project history and repo records.
                </div>
              </div>
            </div>

            {/* Relevant Experience Points */}
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Demonstrated Engineering Experience
              </div>
              <div className="space-y-1.5">
                {activeCandidate.anonymizedProfile.relevantExperience.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Skill Claims (Claimed vs Supported vs Unverified) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Skill Claims Audit from Resume
                </div>
                <span className="text-[11px] text-slate-400">
                  Claims are verified via practical challenges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCandidate.extractedSkills.map((sk) => {
                  const isSupported = sk.status === 'supported';
                  const isUnverified = sk.status === 'unverified';
                  return (
                    <div
                      key={sk.skill}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isSupported 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : isUnverified 
                          ? 'bg-amber-50/50 border-amber-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{sk.skill}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isSupported 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isUnverified 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isSupported ? 'Supported ✓' : isUnverified ? 'Unverified ?' : 'Claimed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {sk.evidenceSnippet}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signals Redaction Summary */}
            <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>{activeCandidate.personalSignalsHidden.totalSignalsSuppressed}</strong> personal signals suppressed (Names, contact info, photo, gender).
                </span>
              </div>
              <button
                onClick={() => onOpenPrivacyAudit(activeCandidate)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Inspect Audit Log
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
