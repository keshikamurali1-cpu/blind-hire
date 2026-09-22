import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Candidate, ClaimStatus } from '../types';

interface Step4SkillClaimsProps {
  candidates: Candidate[];
  onContinue: () => void;
  onBack: () => void;
}

export const Step4SkillClaims: React.FC<Step4SkillClaimsProps> = ({
  candidates,
  onContinue,
  onBack,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id || ''
  );

  const activeCandidate = 
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  if (!activeCandidate) {
    return null;
  }

  // Count claims by status
  const supportedCount = activeCandidate.extractedSkills.filter((s) => s.status === 'supported').length;
  const claimedCount = activeCandidate.extractedSkills.filter((s) => s.status === 'claimed').length;
  const unverifiedCount = activeCandidate.extractedSkills.filter((s) => s.status === 'unverified').length;

  const renderStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Supported</span>
          </span>
        );
      case 'claimed':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Claimed</span>
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Unverified</span>
          </span>
        );
    }
  };

  const renderStatusSubtitle = (status: ClaimStatus) => {
    switch (status) {
      case 'supported':
        return '✓ Supported by project evidence';
      case 'claimed':
        return '✓ Mentioned in resume';
      case 'unverified':
      default:
        return '? Unverified in documented projects';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What does each resume claim?
        </h1>
        <p className="text-sm text-slate-600">
          Review the skills identified from each candidate's resume.
        </p>
      </div>

      {/* Simple Candidate Selector */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
        {candidates.map((cand) => {
          const isSelected = cand.id === activeCandidate.id;
          return (
            <button
              key={cand.id}
              onClick={() => setSelectedCandidateId(cand.id)}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer text-center ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cand.anonymousLabel}
            </button>
          );
        })}
      </div>

      {/* Claims Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900">{activeCandidate.anonymousLabel} Claims:</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-600">{activeCandidate.anonymizedProfile.headline}</span>
        </div>

        <div className="flex items-center space-x-3 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {supportedCount} Supported
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {claimedCount} Claimed
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {unverifiedCount} Unverified
          </span>
        </div>
      </div>

      {/* Skills Vertical List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Skills & Evidence Found
          </h2>
          <span className="text-[11px] text-slate-600 font-medium">
            3 simple statuses: 🟢 Supported, 🟡 Claimed, ⚪ Unverified
          </span>
        </div>

        <div className="space-y-3">
          {activeCandidate.extractedSkills.map((skillClaim) => (
            <div
              key={skillClaim.skill}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">{skillClaim.skill}</h3>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {renderStatusSubtitle(skillClaim.status)}
                </p>
                {skillClaim.evidenceSnippet && (
                  <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200/60 mt-1.5">
                    "{skillClaim.evidenceSnippet}"
                  </p>
                )}
              </div>

              <div className="shrink-0 self-start sm:self-center">
                {renderStatusBadge(skillClaim.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <span>Generate Evidence Challenges</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
