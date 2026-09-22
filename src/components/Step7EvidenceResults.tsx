import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  X, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Download,
  Share2,
  FileText,
  Printer
} from 'lucide-react';
import { Candidate, Evaluation, EvidenceStatus } from '../types';
import { ExportPdfModal } from './ExportPdfModal';
import { generateEvidencePdf } from '../utils/pdfGenerator';

interface Step7EvidenceResultsProps {
  evaluation: Evaluation;
  activeCandidate: Candidate;
  candidates: Candidate[];
  onSelectCandidate: (candidateId: string) => void;
  onCompareCandidates: () => void;
  onBack: () => void;
  currentUser?: {
    name?: string;
    organization?: string;
  } | null;
}

export const Step7EvidenceResults: React.FC<Step7EvidenceResultsProps> = ({
  evaluation,
  activeCandidate,
  candidates,
  onSelectCandidate,
  onCompareCandidates,
  onBack,
  currentUser,
}) => {
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQuickDownloading, setIsQuickDownloading] = useState(false);

  // Compute capabilities list with their respective evidence status
  // Extract all requirements from blueprint
  const allReqs = [
    ...evaluation.blueprint.technicalSkills,
    ...evaluation.blueprint.coreCapabilities,
  ];

  // Helper to determine status for a capability
  const getCapabilityEvidence = (skillName: string) => {
    // Check submissions
    const matchedChallenge = evaluation.assessments.find(
      (a) => a.skill.toLowerCase() === skillName.toLowerCase()
    );
    const submission = matchedChallenge ? activeCandidate.submissions?.[matchedChallenge.id] : null;

    // Check resume extracted skills
    const claim = activeCandidate.extractedSkills.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
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
      skill: skillName,
      status,
      jobRequirement: `The role requires demonstrated proficiency in ${skillName}.`,
      resumeClaim: claim ? `Candidate reported ${skillName} (${claim.status}) in resume.` : 'Not explicitly highlighted on resume.',
      challenge: challengeTitle,
      resultText: status === 'demonstrated' ? 'Demonstrated ✓' : status === 'partial' ? 'Partial Evidence 🟡' : 'Unverified ⚪',
      why: why || 'The submitted solution correctly handled the expected logic and returned the required result.',
      candidateSnippet,
    };
  };

  const capabilitiesEvidence = allReqs.map((req) => getCapabilityEvidence(req.name));

  // Count supported capabilities (demonstrated + partial)
  const supportedCount = capabilitiesEvidence.filter(
    (c) => c.status === 'demonstrated' || c.status === 'partial'
  ).length;
  const totalCount = capabilitiesEvidence.length;

  const activeDetailData = selectedSkillDetail
    ? capabilitiesEvidence.find((c) => c.skill === selectedSkillDetail)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Evidence Profile
        </h1>
        <p className="text-sm text-slate-600">
          A clear view of what the candidate demonstrated. Grounded in work evidence, not gut feeling.
        </p>
      </div>

      {/* Candidate Selector Bar */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
        {candidates.map((cand) => {
          const isSelected = cand.id === activeCandidate.id;
          return (
            <button
              key={cand.id}
              onClick={() => {
                onSelectCandidate(cand.id);
                setSelectedSkillDetail(null);
              }}
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

      {/* Evidence Coverage Card (Not a huge fake percentage) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {activeCandidate.anonymousLabel}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {activeCandidate.anonymizedProfile.educationLevel}
            </p>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Blind profile • Personal signals masked</span>
            </span>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 px-2.5 py-1 rounded-full transition cursor-pointer"
              title="Export clean PDF summary for stakeholders"
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
            Evidence coverage
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {supportedCount} of {totalCount} capabilities supported by evidence
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(supportedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Simple Vertical List of Capabilities */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Role Capabilities & Demonstrated Evidence
          </h2>
          <span className="text-[11px] text-slate-600 font-medium">
            Click any skill to view explainable details
          </span>
        </div>

        <div className="space-y-2.5">
          {capabilitiesEvidence.map((cap) => {
            const isDemonstrated = cap.status === 'demonstrated';
            const isPartial = cap.status === 'partial';

            return (
              <button
                key={cap.skill}
                onClick={() => setSelectedSkillDetail(cap.skill)}
                className="w-full text-left p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/70 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      isDemonstrated
                        ? 'bg-emerald-500 ring-4 ring-emerald-50'
                        : isPartial
                        ? 'bg-amber-500 ring-4 ring-amber-50'
                        : 'bg-slate-300 ring-4 ring-slate-100'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cap.skill}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      isDemonstrated
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isPartial
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isDemonstrated ? '🟢 Demonstrated' : isPartial ? '🟡 Partial' : '⚪ Unverified'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 flex items-center gap-0.5">
                    <span className="hidden sm:inline">Details</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progressive Disclosure: Skill Evidence Details Drawer / Panel */}
      {activeDetailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Explainable Audit
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeDetailData.skill} Evidence
                </h3>
              </div>
              <button
                onClick={() => setSelectedSkillDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Job Requirement */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Job Requirement
                </span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {activeDetailData.jobRequirement}
                </p>
              </div>

              {/* Resume Claim */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Resume Claim
                </span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {activeDetailData.resumeClaim}
                </p>
              </div>

              {/* Challenge */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Challenge
                </span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {activeDetailData.challenge}
                </p>
              </div>

              {/* Result */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Result
                </span>
                <p className="font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {activeDetailData.resultText}
                </p>
              </div>

              {/* Why? */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                  Why? (AI Evaluation Rationale)
                </span>
                <p className="text-slate-700 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 leading-relaxed">
                  {activeDetailData.why}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSkillDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification</span>
        </button>

        <div className="flex items-center space-x-2.5">
          {/* Export PDF Summary Button (Primary export feature) */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF Summary</span>
          </button>

          {/* Quick Direct Download Button */}
          <button
            type="button"
            disabled={isQuickDownloading}
            onClick={() => {
              setIsQuickDownloading(true);
              setTimeout(() => {
                try {
                  const doc = generateEvidencePdf(
                    evaluation, 
                    activeCandidate, 
                    capabilitiesEvidence,
                    {
                      includeCodeSnippets: true,
                      includeInterviewGuide: true,
                      recruiterNotes: 'Candidate demonstrated strong technical proficiency on required core capabilities with verified work samples.',
                      preparedBy: currentUser?.name || 'Recruiter Review Panel',
                      organization: currentUser?.organization || 'Engineering Hiring Team',
                    }
                  );
                  doc.save(`${activeCandidate.anonymousLabel.replace(/\s+/g, '_')}_Verified_Evidence_Profile.pdf`);
                } catch (err) {
                  console.error('Quick download PDF error:', err);
                } finally {
                  setIsQuickDownloading(false);
                }
              }, 100);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition cursor-pointer"
            title="Directly download clean PDF file"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{isQuickDownloading ? 'Saving...' : 'Quick PDF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const demonstratedCount = capabilitiesEvidence.filter((c) => c.status === 'demonstrated').length;
              const partialCount = capabilitiesEvidence.filter((c) => c.status === 'partial').length;
              const unverifiedCount = capabilitiesEvidence.filter((c) => c.status === 'unverified').length;
              const coveragePct = Math.round((supportedCount / Math.max(1, totalCount)) * 100);

              const exportData = {
                candidate: activeCandidate.anonymousLabel,
                jobTitle: evaluation.jobTitle,
                evidenceCoverage: `${coveragePct}%`,
                skillsDemonstrated: demonstratedCount,
                skillsPartial: partialCount,
                skillsUnverified: unverifiedCount,
                matrix: capabilitiesEvidence.map((c) => ({
                  requirement: c.skill,
                  status: c.status,
                  why: c.why,
                }))
              };
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${activeCandidate.anonymousLabel.replace(/\s+/g, '_')}_Evidence_Summary.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition cursor-pointer"
            title="Download raw JSON data"
          >
            <span className="text-xs">JSON</span>
          </button>

          <button
            type="button"
            onClick={onCompareCandidates}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Export PDF Modal */}
      {isExportModalOpen && (
        <ExportPdfModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          evaluation={evaluation}
          candidate={activeCandidate}
          capabilities={capabilitiesEvidence}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
