import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Eye, 
  ShieldCheck, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Candidate, Evaluation, EvidenceStatus } from '../types';
import { ExportPdfModal } from './ExportPdfModal';
import { CapabilityItem } from '../utils/pdfGenerator';

interface CandidateComparisonScreenProps {
  evaluation: Evaluation;
  onSelectCandidateEvidence: (candidateId: string) => void;
  onBackToHome?: () => void;
  currentUser?: {
    name?: string;
    organization?: string;
  } | null;
}

export const CandidateComparisonScreen: React.FC<CandidateComparisonScreenProps> = ({
  evaluation,
  onSelectCandidateEvidence,
  onBackToHome,
  currentUser,
}) => {
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    evaluation.candidates.map((c) => c.id)
  );
  const [exportCandidate, setExportCandidate] = useState<Candidate | null>(null);

  const toggleCandidate = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds(selectedCandidateIds.filter((cid) => cid !== id));
      }
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, id]);
    }
  };

  const selectedCandidates = evaluation.candidates.filter((c) =>
    selectedCandidateIds.includes(c.id)
  );

  // Requirements from evaluation blueprint
  const capabilities = [
    ...evaluation.blueprint.technicalSkills,
    ...evaluation.blueprint.coreCapabilities,
  ];

  const getEvidenceStatus = (cand: Candidate, skillName: string): EvidenceStatus => {
    const matchedChallenge = evaluation.assessments.find(
      (a) => a.skill.toLowerCase() === skillName.toLowerCase()
    );
    const sub = matchedChallenge ? cand.submissions?.[matchedChallenge.id] : null;
    if (sub) return sub.status;

    const claim = cand.extractedSkills.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    if (claim?.status === 'supported') return 'partial';
    return 'unverified';
  };

  const getCandidateCapabilities = (cand: Candidate): CapabilityItem[] => {
    return capabilities.map((req) => {
      const matchedChallenge = evaluation.assessments.find(
        (a) => a.skill.toLowerCase() === req.name.toLowerCase()
      );
      const submission = matchedChallenge ? cand.submissions?.[matchedChallenge.id] : null;
      const claim = cand.extractedSkills.find(
        (s) => s.skill.toLowerCase() === req.name.toLowerCase()
      );

      let status: EvidenceStatus = 'unverified';
      let challengeTitle = matchedChallenge?.title || 'Practical skill challenge';
      let why = '';
      let candidateSnippet = submission?.codeOrAnswer || 'No code submitted yet.';

      if (submission) {
        status = submission.status;
        why = submission.aiExplanation;
      } else if (claim?.status === 'supported') {
        status = 'partial';
        why = 'Skill was supported in resume projects, but not yet tested in a practical challenge.';
      } else if (claim?.status === 'claimed') {
        status = 'unverified';
        why = 'Mentioned on resume without verified project or challenge evidence.';
      } else {
        status = 'unverified';
        why = 'No verified evidence submitted for this role capability.';
      }

      return {
        skill: req.name,
        status,
        jobRequirement: `The role requires demonstrated proficiency in ${req.name}.`,
        resumeClaim: claim ? `Candidate reported ${req.name} (${claim.status}) in resume.` : 'Not explicitly highlighted on resume.',
        challenge: challengeTitle,
        resultText: status === 'demonstrated' ? 'Demonstrated ✓' : status === 'partial' ? 'Partial Evidence 🟡' : 'Unverified ⚪',
        why: why || 'The submitted solution correctly handled the expected logic and returned the required result.',
        candidateSnippet,
      };
    });
  };

  const renderBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'demonstrated':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg">
            <span>🟢 Demonstrated</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg">
            <span>🟡 Partial</span>
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg">
            <span>⚪ Unverified</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Evidence Comparison
            </h1>
            <p className="text-sm text-slate-600">
              Side-by-side evidence matrix for <strong className="text-slate-800">{evaluation.jobTitle}</strong>.
            </p>
          </div>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>

      {/* Recruiter Judgment Disclaimer (Important requirement) */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <strong className="font-bold">Recruiter Judgment Required: </strong>
            <span>
              BlindHire provides objective evidence coverage, not automated hiring decisions. Review submitted code, trade-offs, and candidate experience before final decisions.
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Filter Selector */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Select Candidates to Compare
        </span>
        <div className="flex flex-wrap gap-2">
          {evaluation.candidates.map((cand) => {
            const isSelected = selectedCandidateIds.includes(cand.id);
            return (
              <button
                key={cand.id}
                onClick={() => toggleCandidate(cand.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cand.anonymousLabel}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Comparison Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs">
                  Capability / Skill
                </th>
                {selectedCandidates.map((cand) => (
                  <th key={cand.id} className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center justify-between">
                      <span>{cand.anonymousLabel}</span>
                      <button
                        onClick={() => onSelectCandidateEvidence(cand.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                        title="View complete evidence profile"
                      >
                        Profile →
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {capabilities.map((req) => (
                <tr key={req.id || req.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span>{req.name}</span>
                      {req.required && (
                        <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                          Req
                        </span>
                      )}
                    </div>
                  </td>
                  {selectedCandidates.map((cand) => {
                    const status = getEvidenceStatus(cand, req.name);
                    return (
                      <td key={cand.id} className="py-3 px-4">
                        {renderBadge(status)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {selectedCandidates.map((cand) => {
          const supported = capabilities.filter((req) => {
            const st = getEvidenceStatus(cand, req.name);
            return st === 'demonstrated' || st === 'partial';
          }).length;

          return (
            <div
              key={cand.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{cand.anonymousLabel}</h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {cand.anonymizedProfile.educationLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">{supported} of {capabilities.length}</strong> capabilities supported
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => onSelectCandidateEvidence(cand.id)}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold rounded-xl transition cursor-pointer text-center block"
                >
                  View Evidence Profile
                </button>
                <button
                  onClick={() => setExportCandidate(cand)}
                  className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl transition cursor-pointer"
                  title="Export clean PDF summary for stakeholders"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export PDF Modal */}
      {exportCandidate && (
        <ExportPdfModal
          isOpen={!!exportCandidate}
          onClose={() => setExportCandidate(null)}
          evaluation={evaluation}
          candidate={exportCandidate}
          capabilities={getCandidateCapabilities(exportCandidate)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
