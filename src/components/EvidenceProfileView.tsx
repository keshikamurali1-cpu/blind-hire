import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  EyeOff, 
  HelpCircle, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Code2, 
  FileText, 
  ExternalLink,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { Candidate, Evaluation, EvidenceMatrixRow, EvidenceStatus } from '../types';

interface EvidenceProfileViewProps {
  evaluation: Evaluation;
  selectedCandidate: Candidate;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenPassport: () => void;
  onSwitchToAssessments: () => void;
}

export const EvidenceProfileView: React.FC<EvidenceProfileViewProps> = ({
  evaluation,
  selectedCandidate,
  onSelectCandidate,
  onOpenPassport,
  onSwitchToAssessments,
}) => {
  const [selectedRowDetail, setSelectedRowDetail] = useState<EvidenceMatrixRow | null>(null);

  // Compute Evidence Matrix rows for this candidate based on job requirements + extracted skills + submissions
  const allRequirements = [
    ...evaluation.blueprint.technicalSkills,
    ...evaluation.blueprint.coreCapabilities,
  ];

  const rows: EvidenceMatrixRow[] = allRequirements.map((req) => {
    const extracted = selectedCandidate.extractedSkills.find(
      (s) => s.skill.toLowerCase() === req.name.toLowerCase()
    );
    const challenge = evaluation.assessments.find(
      (a) => a.skill.toLowerCase() === req.name.toLowerCase()
    );
    const submission = challenge ? selectedCandidate.submissions[challenge.id] : undefined;

    let resumeClaimStatus = extracted ? extracted.status : ('unverified' as const);
    let challengeStatus: 'completed' | 'attempted' | 'not_attempted' = 'not_attempted';
    let evidenceStatus: EvidenceStatus = 'unverified';

    if (submission) {
      challengeStatus = 'completed';
      evidenceStatus = submission.status;
    } else if (extracted?.status === 'supported') {
      evidenceStatus = 'partial'; // Supported by resume but unverified by challenge
    } else if (req.required) {
      evidenceStatus = 'gap';
    }

    const jobWhy = req.explanation;
    const resumeSnippet = extracted?.evidenceSnippet || 'No explicit project evidence found in resume.';
    const challengePrompt = challenge?.description || 'No challenge assigned yet for this capability.';
    const candidateResp = submission?.codeOrAnswer || 'Not attempted yet by candidate.';
    const aiReason = submission?.aiExplanation || (
      extracted?.status === 'supported' 
        ? 'Resume provided relevant project context, but practical challenge has not yet been completed.'
        : 'Requirement remains unverified due to lack of practical code submission.'
    );

    return {
      capability: req.name,
      category: req.category as any,
      resumeClaim: resumeClaimStatus,
      challengeStatus,
      evidenceStatus,
      explanation: aiReason,
      jobRequirementWhy: jobWhy,
      resumeEvidenceSnippet: resumeSnippet,
      challengePrompt,
      candidateResponseSnippet: candidateResp,
      aiEvaluationReason: aiReason,
    };
  });

  // Calculate Evidence Coverage Metrics (Never an opaque 87% match score!)
  const totalRequired = rows.length;
  const demonstratedCount = rows.filter((r) => r.evidenceStatus === 'demonstrated').length;
  const partialCount = rows.filter((r) => r.evidenceStatus === 'partial').length;
  const unverifiedCount = rows.filter((r) => r.evidenceStatus === 'unverified').length;
  const gapCount = rows.filter((r) => r.evidenceStatus === 'gap').length;
  const coveredCount = demonstratedCount + partialCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Emotional / Product "Aha Moment" Quote Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-widest flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The BlindHire Paradigm</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-slate-100 italic max-w-2xl leading-relaxed">
            &ldquo;A resume tells us what a candidate says they can do.{' '}
            <span className="text-amber-300 font-semibold not-italic">
              BlindHire creates evidence of what they can demonstrate.
            </span>&rdquo;
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenPassport}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Candidate Passport</span>
          </button>
        </div>
      </div>

      {/* Candidate Profile Selector & Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
              {selectedCandidate.anonymousLabel.replace('Candidate ', '#')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Candidate Evidence Profile
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {selectedCandidate.anonymousLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                <span>{selectedCandidate.anonymizedProfile.educationLevel}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Personal signals hidden
                </span>
              </p>
            </div>
          </div>

          {/* Candidate Switcher Dropdown/Pills */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 px-2">Switch Candidate:</span>
            {evaluation.candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCandidate(c)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  c.id === selectedCandidate.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.anonymousLabel}
              </button>
            ))}
          </div>
        </div>

        {/* EVIDENCE COVERAGE SECTION (Explicitly replaces arbitrary match scores!) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evidence Coverage Indicator
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {coveredCount} of {totalRequired} required capabilities have evidence
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Evaluated through verified challenge execution and audited project references.
              </div>
            </div>

            {/* Status counts breakdown */}
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Demonstrated: {demonstratedCount}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Partial: {partialCount}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Unverified: {unverifiedCount}</span>
              </div>

              {gapCount > 0 && (
                <div className="flex items-center space-x-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Gap: {gapCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Evidence Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Verified Evidence Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any row to open the complete explainable evidence audit (Requirement, Resume, Challenge, and AI Evaluation).
            </p>
          </div>

          <button
            onClick={onSwitchToAssessments}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg transition cursor-pointer"
          >
            Run Another Challenge
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Capability</th>
                <th className="py-3.5 px-4">Resume Claim</th>
                <th className="py-3.5 px-4">Practical Challenge</th>
                <th className="py-3.5 px-4">Evidence Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                return (
                  <tr
                    key={row.capability}
                    onClick={() => setSelectedRowDetail(row)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Capability */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {row.capability}
                      </span>
                      <span className="block text-[10px] text-slate-400 capitalize">
                        {row.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Resume Claim */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.resumeClaim === 'supported'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.resumeClaim === 'claimed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {row.resumeClaim === 'supported' ? 'Supported ✓' : row.resumeClaim === 'claimed' ? 'Claimed' : 'Unverified'}
                      </span>
                    </td>

                    {/* Challenge */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-600 font-medium">
                        {row.challengeStatus === 'completed' ? (
                          <span className="text-indigo-700 font-semibold flex items-center">
                            <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Completed (5 min)
                          </span>
                        ) : (
                          <span className="text-slate-400">Not attempted</span>
                        )}
                      </span>
                    </td>

                    {/* Evidence Status */}
                    <td className="py-3.5 px-4">
                      {row.evidenceStatus === 'demonstrated' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5"></span>
                          Demonstrated
                        </span>
                      )}
                      {row.evidenceStatus === 'partial' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-600 mr-1.5"></span>
                          Partial Evidence
                        </span>
                      )}
                      {row.evidenceStatus === 'unverified' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                          <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5"></span>
                          Unverified
                        </span>
                      )}
                      {row.evidenceStatus === 'gap' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5"></span>
                          Requirement Gap
                        </span>
                      )}
                    </td>

                    {/* Details arrow */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-slate-400 group-hover:text-indigo-600 text-xs font-semibold inline-flex items-center">
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPLAINABILITY DRAWER / MODAL (Evidence Details) */}
      {selectedRowDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Evidence Explainability Audit
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedRowDetail.capability}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              selectedRowDetail.evidenceStatus === 'demonstrated'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : selectedRowDetail.evidenceStatus === 'partial'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}>
              <div className="text-xs font-bold">
                Assigned Status: <span className="uppercase">{selectedRowDetail.evidenceStatus}</span>
              </div>
              <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded">
                Candidate: {selectedCandidate.anonymousLabel}
              </span>
            </div>

            {/* 1. What the job requires */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                1. What the Job Requires
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                {selectedRowDetail.jobRequirementWhy}
              </div>
            </div>

            {/* 2. What the resume stated */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                2. What the Resume Stated
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 font-mono text-[11px]">
                {selectedRowDetail.resumeEvidenceSnippet}
              </div>
            </div>

            {/* 3. Challenge tested */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                3. What was Tested in Challenge
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                {selectedRowDetail.challengePrompt}
              </div>
            </div>

            {/* 4. Candidate response */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                4. Candidate Submission
              </div>
              <div className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36">
                <pre>{selectedRowDetail.candidateResponseSnippet}</pre>
              </div>
            </div>

            {/* 5. AI Evaluation: Why this evidence matters */}
            <div className="space-y-1 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>5. Why this Evidence Matters (Explainable AI Rationale)</span>
              </div>
              <p className="text-xs text-indigo-900 mt-1 leading-relaxed">
                {selectedRowDetail.aiEvaluationReason}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
