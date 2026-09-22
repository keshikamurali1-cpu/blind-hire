import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Lock, 
  ShieldAlert, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Candidate, Evaluation, EvidenceStatus } from '../types';

interface CandidateComparisonViewProps {
  evaluation: Evaluation;
  onSelectCandidate: (candidate: Candidate) => void;
  onViewCandidateEvidence: (candidate: Candidate) => void;
}

export const CandidateComparisonView: React.FC<CandidateComparisonViewProps> = ({
  evaluation,
  onSelectCandidate,
  onViewCandidateEvidence,
}) => {
  const candidates = evaluation.candidates;
  const capabilities = [
    ...evaluation.blueprint.technicalSkills,
    ...evaluation.blueprint.coreCapabilities,
  ];

  // Helper to get a candidate's evidence status for a given capability
  const getCandidateEvidence = (candidate: Candidate, skillName: string): {
    status: EvidenceStatus;
    label: string;
    details: string;
  } => {
    // Check if challenge submitted
    const challenge = evaluation.assessments.find(
      (a) => a.skill.toLowerCase() === skillName.toLowerCase()
    );
    const submission = challenge ? candidate.submissions[challenge.id] : undefined;

    if (submission) {
      return {
        status: submission.status,
        label: submission.status === 'demonstrated' ? 'Demonstrated' : submission.status === 'partial' ? 'Partial' : 'Gap',
        details: submission.aiExplanation,
      };
    }

    // Check extracted skills from resume
    const extracted = candidate.extractedSkills.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );

    if (extracted?.status === 'supported') {
      return {
        status: 'partial',
        label: 'Supported (Resume)',
        details: extracted.evidenceSnippet || 'Supported by resume project evidence, pending challenge.',
      };
    }

    if (extracted?.status === 'claimed') {
      return {
        status: 'unverified',
        label: 'Claimed (Unverified)',
        details: 'Claimed in resume, no verifiable challenge or project detail provided.',
      };
    }

    return {
      status: 'unverified',
      label: 'Unverified',
      details: 'No candidate evidence or challenge record found.',
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Mandatory Recruiter Judgment Notice */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Comparative Evidence Matrix</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Candidate Evidence Comparison for {evaluation.jobTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare candidates side-by-side using objective evidence statuses rather than mysterious percentile scores.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Names and demographic signals suppressed</span>
          </div>
        </div>

        {/* Mandatory Recruiter Judgment Banner (Strict prompt mandate) */}
        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 flex items-start space-x-3 text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <span className="font-bold uppercase tracking-wide text-amber-900">
              Recruiter Judgment Required
            </span>
            <p className="text-amber-800 leading-relaxed">
              BlindHire provides verified evidence and objective task evaluations; the recruiter and hiring team make the final hiring decision. The platform does not automate final rejections or offers.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-5 text-slate-500 font-semibold w-1/4">
                  Job Requirement / Skill
                </th>
                {candidates.map((cand) => (
                  <th key={cand.id} className="py-4 px-5 text-slate-900 font-bold w-1/4 border-l border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{cand.anonymousLabel}</span>
                        <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                          {cand.anonymizedProfile.educationLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => onViewCandidateEvidence(cand)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capabilities.map((cap) => (
                <tr key={cap.name} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-5 bg-slate-50/40">
                    <span className="font-bold text-slate-900">{cap.name}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {cap.explanation}
                    </span>
                  </td>

                  {candidates.map((cand) => {
                    const ev = getCandidateEvidence(cand, cap.name);
                    return (
                      <td key={cand.id} className="py-4 px-5 border-l border-slate-200 align-top">
                        <div className="space-y-1">
                          {ev.status === 'demonstrated' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
                              Demonstrated
                            </span>
                          )}

                          {ev.status === 'partial' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
                              {ev.label}
                            </span>
                          )}

                          {ev.status === 'unverified' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                              {ev.label}
                            </span>
                          )}

                          {ev.status === 'gap' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5"></span>
                              Gap
                            </span>
                          )}

                          <p className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-2">
                            {ev.details}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
