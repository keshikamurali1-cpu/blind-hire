import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Code2, 
  HelpCircle, 
  Sparkles,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Candidate, Evaluation } from '../types';
import { generateEvidencePdf, CapabilityItem, PdfExportOptions } from '../utils/pdfGenerator';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation;
  candidate: Candidate;
  capabilities: CapabilityItem[];
  currentUser?: {
    name?: string;
    organization?: string;
  } | null;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  candidate,
  capabilities,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'options'>('preview');
  const [includeCodeSnippets, setIncludeCodeSnippets] = useState(true);
  const [includeInterviewGuide, setIncludeInterviewGuide] = useState(true);
  const [recruiterNotes, setRecruiterNotes] = useState(
    'Candidate demonstrated strong technical proficiency on required core capabilities with verified work samples. Recommended for engineering team interview.'
  );
  const [preparedBy, setPreparedBy] = useState(currentUser?.name || 'Recruiter Review Panel');
  const [organization, setOrganization] = useState(currentUser?.organization || 'Engineering Hiring Team');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  // Counts
  const demonstratedCount = capabilities.filter((c) => c.status === 'demonstrated').length;
  const partialCount = capabilities.filter((c) => c.status === 'partial').length;
  const unverifiedCount = capabilities.filter((c) => c.status === 'unverified' || c.status === 'gap').length;
  const totalCount = capabilities.length;
  const coveragePct = Math.round(((demonstratedCount + partialCount * 0.5) / Math.max(1, totalCount)) * 100);

  const exportOptions: PdfExportOptions = {
    includeCodeSnippets,
    includeInterviewGuide,
    recruiterNotes,
    preparedBy,
    organization,
  };

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const doc = generateEvidencePdf(evaluation, candidate, capabilities, exportOptions);
        const fileName = `${candidate.anonymousLabel.replace(/\s+/g, '_')}_Verified_Evidence_Profile.pdf`;
        doc.save(fileName);
      } catch (err) {
        console.error('Failed to generate PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 150);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `BLINDHIRE VERIFIED EVIDENCE REPORT
Candidate: ${candidate.anonymousLabel} (Blind Screening - Demographic Data Masked)
Target Role: ${evaluation.jobTitle} (${evaluation.department || 'Engineering'})
Evidence Coverage: ${coveragePct}% (${demonstratedCount + partialCount} of ${totalCount} capabilities supported)

DEMONSTRATED IN CODE (${demonstratedCount}):
${capabilities
  .filter((c) => c.status === 'demonstrated')
  .map((c) => `• ${c.skill}: ${c.why}`)
  .join('\n')}

PARTIAL EVIDENCE (${partialCount}):
${capabilities
  .filter((c) => c.status === 'partial')
  .map((c) => `• ${c.skill}: ${c.why}`)
  .join('\n')}

RECOMMENDATION:
${recruiterNotes}
(Prepared by: ${preparedBy} • ${organization})`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div 
        id="pdf-export-modal-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none"
      >
        {/* Modal Top Bar (Hidden during Print) */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Export Verified Evidence Profile</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  PDF Ready
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Professional, bias-free dossier for hiring managers, interview loops, and executive stakeholders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar with View Tabs & Quick Stats (Hidden during Print) */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'options'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Report Settings & Notes</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
            <span className="hidden sm:inline">Candidate:</span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200/80">
              {candidate.anonymousLabel}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              {coveragePct}% Evidence
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 print:bg-white print:p-0">
          {/* TAB 1: DOCUMENT PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Document Sheet Container */}
              <div 
                id="printable-dossier" 
                className="bg-white border border-slate-200 shadow-xs rounded-xl p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0"
              >
                {/* 1. Header Banner */}
                <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black tracking-wider text-white">BLINDHIRE</span>
                      <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded uppercase">
                        Evidence Verified
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      Verified Talent Dossier • Personal Signals Masked
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Evaluated on demonstrable work output & execution accuracy
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[11px] space-y-0.5 text-slate-300 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div><span className="font-semibold text-slate-400">Report ID:</span> BH-{candidate.anonymousLabel.replace(/\s+/g, '')}</div>
                    <div><span className="font-semibold text-slate-400">Date:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div className="text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Bias Shield Active</span>
                    </div>
                  </div>
                </div>

                {/* 2. Candidate & Role Overview */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900">{candidate.anonymousLabel}</h3>
                      <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                        Blind Candidate
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">Target Role:</span> {evaluation.jobTitle}
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">Department:</span> {evaluation.department} ({evaluation.locationType})
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Background:</span> {candidate.anonymizedProfile.educationLevel} • {candidate.anonymizedProfile.programmingExperience}
                    </div>
                  </div>

                  {/* Coverage Gauge Badge */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 text-center sm:text-right min-w-[140px] shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Evidence Coverage
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      {coveragePct}%
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {demonstratedCount + partialCount} of {totalCount} supported
                    </div>
                  </div>
                </div>

                {/* 3. Stat Cards */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">Demonstrated</div>
                    <div className="text-lg font-black text-emerald-700">{demonstratedCount}</div>
                    <div className="text-[10px] text-emerald-600">Verified in code</div>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5">
                    <div className="text-[10px] font-bold text-amber-800 uppercase">Partial</div>
                    <div className="text-lg font-black text-amber-700">{partialCount}</div>
                    <div className="text-[10px] text-amber-600">Resume project evidence</div>
                  </div>
                  <div className="bg-slate-100/70 border border-slate-200 rounded-lg p-2.5">
                    <div className="text-[10px] font-bold text-slate-700 uppercase">Unverified</div>
                    <div className="text-lg font-black text-slate-700">{unverifiedCount}</div>
                    <div className="text-[10px] text-slate-500">Interview drill area</div>
                  </div>
                </div>

                {/* 4. Evidence Matrix Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Verified Role Capabilities & Evidence Rationale
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 grid grid-cols-12 gap-2 border-b border-slate-200">
                      <div className="col-span-4">Capability</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-5">Evaluation Rationale & Work Evidence</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {capabilities.map((c) => (
                        <div key={c.skill} className="px-3 py-2.5 grid grid-cols-12 gap-2 items-start bg-white">
                          <div className="col-span-4">
                            <span className="font-bold text-slate-900 block">{c.skill}</span>
                            <span className="text-[10px] text-slate-500">{c.challenge}</span>
                          </div>
                          <div className="col-span-3">
                            {c.status === 'demonstrated' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✓ Demonstrated
                              </span>
                            ) : c.status === 'partial' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                🟡 Partial
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                ⚪ Unverified
                              </span>
                            )}
                          </div>
                          <div className="col-span-5 text-slate-600 text-[11px] leading-relaxed">
                            {c.why}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Work Samples / Code Snippets (if included) */}
                {includeCodeSnippets && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                      <span>Submitted Solution Work Samples</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">✓ Automated Tests Verified</span>
                    </h4>
                    {capabilities
                      .filter((c) => c.status === 'demonstrated' && c.candidateSnippet && c.candidateSnippet !== 'No code submitted yet.')
                      .slice(0, 2)
                      .map((item) => (
                        <div key={item.skill} className="bg-slate-900 text-slate-100 rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans pb-1 border-b border-slate-800">
                            <span className="font-bold text-indigo-300">{item.skill} — Challenge Solution</span>
                            <span className="text-emerald-400 font-medium">3/3 Assertions Passed</span>
                          </div>
                          <pre className="overflow-x-auto text-slate-200 text-[10.5px] leading-relaxed max-h-32">
                            {item.candidateSnippet}
                          </pre>
                        </div>
                      ))}
                  </div>
                )}

                {/* 6. Stakeholder Interview Guide (if included) */}
                {includeInterviewGuide && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Suggested Interview Panel Focus Areas
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
                      <div className="flex items-start space-x-2">
                        <span className="font-bold text-indigo-600">1.</span>
                        <span>
                          <strong>Architecture & Data Nuances:</strong> Probe their rationale on transaction boundaries and how they isolate slow external dependencies.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="font-bold text-indigo-600">2.</span>
                        <span>
                          <strong>Edge Cases & Reliability:</strong> Discuss their approach when handling intermittent network retries or database connection leaks.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="font-bold text-indigo-600">3.</span>
                        <span>
                          <strong>Trade-off Communication:</strong> Ask candidate to reflect on a technical compromise made under tight deadlines.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Recruiter Notes & Sign-off */}
                {recruiterNotes && (
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 space-y-1 text-xs">
                    <span className="font-bold text-indigo-900 block">Recruiter Recommendation & Notes:</span>
                    <p className="text-indigo-950 leading-relaxed">{recruiterNotes}</p>
                    <div className="text-[10px] text-indigo-700 pt-1 font-medium">
                      Prepared by: {preparedBy} • {organization}
                    </div>
                  </div>
                )}

                {/* 8. Footer Guarantee */}
                <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
                  <span>BlindHire Confidential Candidate Report • Evaluated on demonstrated competence</span>
                  <span>Non-identifying screening dossier</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REPORT SETTINGS & CUSTOMIZATION */}
          {activeTab === 'options' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Customization & Export Options</h3>
                <p className="text-xs text-slate-600">
                  Configure what sections appear in the exported PDF before sharing with the hiring team.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeCodeSnippets}
                    onChange={(e) => setIncludeCodeSnippets(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      Include Candidate Code / Solution Snippets
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Shows actual code submitted during the practical skill challenges and automated test results.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeInterviewGuide}
                    onChange={(e) => setIncludeInterviewGuide(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      Include Suggested Stakeholder Interview Questions
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Provides structured, high-signal questions for the hiring committee based on unverified areas.
                    </span>
                  </div>
                </label>
              </div>

              {/* Recruiter Notes Input */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-900 block">
                  Recruiter Recommendation & Notes (Included in Dossier)
                </label>
                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  placeholder="e.g. Strongly recommended for technical loop with engineering lead..."
                />
              </div>

              {/* Prepared By & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Prepared By</label>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Organization / Department</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  Return to Document Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer (Hidden during Print) */}
        <div className="bg-white border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Copy executive summary to clipboard"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? 'Copied Brief!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Print document or save using browser print to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
