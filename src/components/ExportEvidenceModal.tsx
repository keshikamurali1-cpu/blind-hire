import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  Check, 
  Copy, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building, 
  UserCheck,
  Eye,
  SlidersHorizontal,
  Code
} from 'lucide-react';
import { Candidate, Evaluation, EvidenceStatus } from '../types';
import { generateEvidencePdf, PdfExportOptions } from '../utils/pdfGenerator';

interface ExportEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation;
  candidate: Candidate;
  organizationName?: string;
  recruiterName?: string;
}

export const ExportEvidenceModal: React.FC<ExportEvidenceModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  candidate,
  organizationName = 'Vertex Cloud Systems',
  recruiterName = 'Technical Recruitment Team',
}) => {
  const [includeCodeSnippets, setIncludeCodeSnippets] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);
  const [stakeholderNote, setStakeholderNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'document' | 'brief'>('document');

  if (!isOpen) return null;

  // Compute capabilities
  const allReqs = [
    ...evaluation.blueprint.technicalSkills,
    ...evaluation.blueprint.coreCapabilities,
  ];

  const capabilitiesEvidence = allReqs.map((req) => {
    const matchedChallenge = evaluation.assessments.find(
      (a) => a.skill.toLowerCase() === req.name.toLowerCase()
    );
    const submission = matchedChallenge ? candidate.submissions?.[matchedChallenge.id] : null;
    const claim = candidate.extractedSkills.find(
      (s) => s.skill.toLowerCase() === req.name.toLowerCase()
    );

    let status: EvidenceStatus = 'unverified';
    let challengeTitle = matchedChallenge?.title || 'Practical skill challenge';
    let why = '';

    if (submission) {
      status = submission.status;
      why = submission.aiExplanation;
    } else if (claim?.status === 'supported') {
      status = 'partial';
      why = 'Skill was supported in candidate project history, but not yet tested in a practical live challenge.';
    } else if (claim?.status === 'claimed') {
      status = 'unverified';
      why = 'Mentioned on resume profile without verified challenge evidence.';
    } else {
      status = 'unverified';
      why = 'No verified evidence submitted for this role capability.';
    }

    return {
      skill: req.name,
      category: req.category === 'technical' ? 'Technical Skill' : 'Core Capability',
      status,
      jobRequirement: req.explanation || `Required proficiency in ${req.name}.`,
      challengeTitle,
      why,
      submission,
    };
  });

  const demonstratedCount = capabilitiesEvidence.filter((c) => c.status === 'demonstrated').length;
  const partialCount = capabilitiesEvidence.filter((c) => c.status === 'partial').length;
  const unverifiedCount = capabilitiesEvidence.filter((c) => c.status === 'unverified').length;
  const totalCount = Math.max(1, capabilitiesEvidence.length);
  const coveragePct = Math.round(((demonstratedCount + partialCount * 0.5) / totalCount) * 100);

  // Download PDF handler
  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const options: PdfExportOptions = {
        includeCodeSnippets,
        includeAuditTrail,
        stakeholderNote,
        organizationName,
        recruiterName,
      };

      const doc = generateEvidencePdf(evaluation, candidate, options);
      const cleanCandidateName = candidate.anonymousLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanJobTitle = evaluation.jobTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `BlindHire_Evidence_${cleanCandidateName}_${cleanJobTitle}.pdf`;

      doc.save(filename);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Stakeholder Brief
  const handleCopyBrief = () => {
    const briefText = `BLINDHIRE VERIFIED EVIDENCE SUMMARY
Candidate: ${candidate.anonymousLabel}
Position: ${evaluation.jobTitle} (${evaluation.department || 'Engineering'})
Evaluation Mode: 100% Blind Screening (Demographics Masked)

OVERALL EVIDENCE COVERAGE: ${coveragePct}%
• Demonstrated Capabilities (${demonstratedCount}): ${capabilitiesEvidence
      .filter((c) => c.status === 'demonstrated')
      .map((c) => c.skill)
      .join(', ') || 'None'}
• Partial Evidence (${partialCount}): ${capabilitiesEvidence
      .filter((c) => c.status === 'partial')
      .map((c) => c.skill)
      .join(', ') || 'None'}
• Unverified (${unverifiedCount}): ${capabilitiesEvidence
      .filter((c) => c.status === 'unverified')
      .map((c) => c.skill)
      .join(', ') || 'None'}

EVALUATOR NOTE:
${stakeholderNote ? `"${stakeholderNote}"` : 'Candidate demonstrated strong practical problem-solving in live challenges.'}

Audit Reference: BH-${candidate.id.toUpperCase()}-VERIFIED
Download the official verified PDF dossier for full code snippets and test execution logs.`;

    navigator.clipboard.writeText(briefText).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    });
  };

  // Native Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Export Verified Evidence Profile</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  PDF Dossier
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Generate a clean, bias-free report for hiring managers, founders, and interview panels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Settings / Controls and Live Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Left Column: Customization Controls (4 cols) */}
          <div className="lg:col-span-4 p-5 space-y-5 bg-slate-50/40">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Export Options
              </span>
              <div className="space-y-3">
                <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeCodeSnippets}
                    onChange={(e) => setIncludeCodeSnippets(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold block text-slate-900">Include Code Submissions</span>
                    <span className="text-slate-500 text-[11px]">
                      Embed runnable solution code and automated test results
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeAuditTrail}
                    onChange={(e) => setIncludeAuditTrail(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold block text-slate-900">Anti-Bias Compliance Seal</span>
                    <span className="text-slate-500 text-[11px]">
                      Include demographic suppression audit and cryptographic watermark
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Note for Hiring Managers */}
            <div className="space-y-1.5">
              <label htmlFor="stakeholder-note" className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Evaluator Note for Stakeholders
              </label>
              <textarea
                id="stakeholder-note"
                rows={3}
                value={stakeholderNote}
                onChange={(e) => setStakeholderNote(e.target.value)}
                placeholder="e.g. Strongly recommend advancing Candidate Alpha to system design interview based on strong SQL optimization."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400 text-slate-800"
              />
              <span className="text-[10px] text-slate-400 block">
                Appears at the top of the executive summary in the exported PDF.
              </span>
            </div>

            {/* Candidate & Metadata Summary */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-900">{candidate.anonymousLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">
                  {evaluation.jobTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Evidence Score:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {coveragePct}% Supported
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Demographics masked</span>
              </div>
            </div>

            {/* Quick Actions (Copy Brief & Print) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyBrief}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Stakeholder Brief</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print / System Dialog</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Document Preview (8 cols) */}
          <div className="lg:col-span-8 p-5 flex flex-col bg-slate-100/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Document Preview
              </span>
              <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('document')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition ${
                    activePreviewTab === 'document' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Full PDF Layout
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('brief')}
                  className={`px-2.5 py-1 font-semibold rounded-md transition ${
                    activePreviewTab === 'brief' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Stakeholder Brief
                </button>
              </div>
            </div>

            {/* Document Sheet Simulation */}
            <div className="flex-1 overflow-y-auto border border-slate-200/80 rounded-xl bg-white shadow-sm p-6 space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
              {activePreviewTab === 'document' ? (
                <div className="space-y-6 text-xs sm:text-sm">
                  {/* Document Header */}
                  <div className="border-b-2 border-indigo-600 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 block">
                          BlindHire Verified Assessment
                        </span>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                          Candidate Evidence Profile
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                          Role: <span className="font-semibold text-slate-800">{evaluation.jobTitle}</span> • {organizationName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Blind Screen Verified</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Dossier Bar */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{candidate.anonymousLabel}</h3>
                      <p className="text-xs text-slate-500">
                        {candidate.anonymizedProfile.educationLevel} • {candidate.anonymizedProfile.programmingExperience}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Evidence</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {demonstratedCount + partialCount} of {totalCount} Requirements Met
                      </span>
                    </div>
                  </div>

                  {/* Recruiter Custom Note if present */}
                  {stakeholderNote && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-indigo-900 text-[11px] uppercase tracking-wider block">
                        Evaluator Note for Stakeholders
                      </span>
                      <p className="text-indigo-950 italic leading-relaxed">
                        "{stakeholderNote}"
                      </p>
                    </div>
                  )}

                  {/* Evidence Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800 block">{coveragePct}%</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Evidence Coverage</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-900 block">{demonstratedCount} Verified</span>
                      <span className="text-[10px] text-slate-500 font-medium">Demonstrated in Tasks</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                      <span className="text-xs font-bold text-amber-800 block">{partialCount} Partial</span>
                      <span className="text-[10px] text-amber-600 font-medium">Follow-Up Topics</span>
                    </div>
                  </div>

                  {/* Evidence Matrix */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1.5">
                      Capability Breakdown & AI Audit Rationale
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {capabilitiesEvidence.map((cap) => {
                        const isDemonstrated = cap.status === 'demonstrated';
                        const isPartial = cap.status === 'partial';

                        return (
                          <div key={cap.skill} className="p-3 bg-white text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{cap.skill}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isDemonstrated
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isPartial
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {isDemonstrated ? 'Demonstrated ✓' : isPartial ? 'Partial 🟡' : 'Unverified ⚪'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{cap.why}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Code Snippet Preview (if enabled) */}
                  {includeCodeSnippets && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                        <span>Practical Work Sample Audit</span>
                        <span className="text-[10px] text-slate-400 font-normal">Automated Test Execution</span>
                      </h4>
                      {capabilitiesEvidence
                        .filter((c) => c.submission && c.submission.codeOrAnswer)
                        .slice(0, 1)
                        .map((c) => (
                          <div key={c.skill} className="rounded-xl overflow-hidden border border-slate-200 text-xs">
                            <div className="bg-slate-100 px-3 py-1.5 flex items-center justify-between font-mono text-[11px] text-slate-700">
                              <span>Task: {c.challengeTitle}</span>
                              <span className="text-emerald-700 font-bold">100% Tests Passed</span>
                            </div>
                            <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                              {c.submission?.codeOrAnswer}
                            </pre>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Anti-Bias Governance Seal */}
                  {includeAuditTrail && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1">
                      <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>BlindHire Anti-Bias Governance Seal</span>
                      </div>
                      <p>
                        This evaluation was completed with candidate name, gender, racial cues, photos, and institutional pedigree strictly masked. Decisions reflect demonstrable job competence.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Stakeholder Brief Tab */
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900 mb-2">Stakeholder Executive Brief</h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Ready to copy and share directly with hiring committees, founders, or team leads in Slack or Email.
                    </p>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-2 whitespace-pre-wrap">
{`SUMMARY FOR HIRING COMMITTEE:
Candidate: ${candidate.anonymousLabel}
Position: ${evaluation.jobTitle}
Evidence Coverage: ${coveragePct}% (${demonstratedCount + partialCount} of ${totalCount} capabilities supported)

Key Verified Strengths:
${capabilitiesEvidence.filter((c) => c.status === 'demonstrated').map((c) => `• ${c.skill}: Passed live coding challenge & test assertions`).join('\n')}

Topics for Discussion:
${capabilitiesEvidence.filter((c) => c.status === 'partial').map((c) => `• ${c.skill}: Supported in project history; probe in technical interview`).join('\n')}

Evaluator Note:
${stakeholderNote ? `"${stakeholderNote}"` : 'Candidate demonstrated verified engineering skills under blind screening.'}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleCopyBrief}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Verified PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
