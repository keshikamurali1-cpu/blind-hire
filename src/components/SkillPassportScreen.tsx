import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Code2, 
  Share2, 
  Download, 
  ArrowLeft, 
  X, 
  ExternalLink, 
  Check, 
  Lock 
} from 'lucide-react';
import { Candidate, EvidenceStatus } from '../types';

interface SkillPassportScreenProps {
  candidate: Candidate;
  onBack: () => void;
}

interface PassportSkill {
  skill: string;
  status: EvidenceStatus;
  assessmentType: string;
  assessmentDate: string;
  taskTitle: string;
  evidenceSnippet: string;
  explanation: string;
}

export const SkillPassportScreen: React.FC<SkillPassportScreenProps> = ({
  candidate,
  onBack,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<PassportSkill | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const passportSkills: PassportSkill[] = [
    {
      skill: 'Java',
      status: 'demonstrated',
      assessmentType: 'Practical Coding',
      assessmentDate: 'September 22, 2026',
      taskTitle: 'Identify Duplicate Transaction IDs',
      evidenceSnippet: 'public List<String> findDuplicateTransactions(List<Transaction> txs) { ... HashSet tracking with O(N) complexity ... }',
      explanation: 'Candidate submitted an optimal single-pass solution with O(N) runtime and correctly handled null list edge cases.',
    },
    {
      skill: 'SQL',
      status: 'demonstrated',
      assessmentType: 'Query Execution',
      assessmentDate: 'September 22, 2026',
      taskTitle: 'Top 3 Customers by Total Order Value',
      evidenceSnippet: 'SELECT c.name, SUM(o.amount) AS total_spent FROM customers c JOIN orders o ... GROUP BY c.id ORDER BY total_spent DESC LIMIT 3;',
      explanation: 'Query executed against test SQLite database and matched ground-truth records across multi-table joins and aggregation.',
    },
    {
      skill: 'REST APIs',
      status: 'demonstrated',
      assessmentType: 'API Design',
      assessmentDate: 'September 22, 2026',
      taskTitle: 'Idempotent Payment Endpoint Design',
      evidenceSnippet: 'Idempotency-Key header verified in Redis cache before triggering charges; returns HTTP 200 on replay vs 201 on creation.',
      explanation: 'Demonstrated complete understanding of distributed retry safety, cache timeouts, and HTTP status idempotency standards.',
    },
    {
      skill: 'Python',
      status: 'partial',
      assessmentType: 'Practical Coding',
      assessmentDate: 'September 22, 2026',
      taskTitle: 'Sliding Window Rate Limiter',
      evidenceSnippet: 'class RateLimiter: def is_allowed(self, client_id, timestamp): ... deque timestamp tracking ...',
      explanation: 'Algorithmic logic is functional and correct for standard windows, but lacks mutex locking for concurrent multi-thread requests.',
    },
  ];

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Award className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">Skill Evidence Passport</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </header>

      {/* Main Passport View */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 w-full">
        {/* Passport Certificate Card */}
        <div className="bg-white border-2 border-emerald-600/20 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
          {/* Subtle Background Watermark */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-50/50 rounded-full pointer-events-none flex items-center justify-center text-emerald-100">
            <ShieldCheck className="w-36 h-36" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
                Portable Skill Verification Credential
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Skill Evidence Passport
              </h1>
              <p className="text-xs text-slate-500">
                Holder: <strong>{candidate.anonymousLabel}</strong> • ID: <span className="font-mono text-slate-600">BHP-2026-9482-VERIFIED</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cryptographically Verified</span>
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            This passport contains verified first-party evidence collected via short, timed practical coding and query tasks evaluated against strict functional criteria. It reflects demonstrated capabilities independent of personal demographics or pedigree.
          </div>

          {/* Skills Table / List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
              <span>Verified Skill & Type</span>
              <span>Evidence Status</span>
            </div>

            <div className="space-y-2.5">
              {passportSkills.map((ps) => {
                const isDemonstrated = ps.status === 'demonstrated';

                return (
                  <div
                    key={ps.skill}
                    className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{ps.skill}</h3>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{ps.taskTitle}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span>{ps.assessmentType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{ps.assessmentDate}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        isDemonstrated
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isDemonstrated ? 'Demonstrated ✓' : 'Partial 🟡'}
                      </span>

                      <button
                        onClick={() => setSelectedSkill(ps)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-0.5"
                      >
                        <span>View Evidence</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Footer Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Immutable Ledger • Issued by BlindHire Proof Protocol</span>
            </div>

            <button
              onClick={() => alert('Certificate exported in verifiable JSON-LD format.')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Verifiable Credential</span>
            </button>
          </div>
        </div>
      </main>

      {/* Evidence Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Verified Demonstration Audit
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSkill.skill} — {selectedSkill.taskTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Submitted Implementation Snippet
                </span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  {selectedSkill.evidenceSnippet}
                </pre>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  AI Evaluation Rationale
                </span>
                <p className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs leading-relaxed">
                  "{selectedSkill.explanation}"
                </p>
              </div>

              <div className="text-slate-500 text-[11px]">
                Audited & verified on {selectedSkill.assessmentDate} via {selectedSkill.assessmentType}.
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSkill(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
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
