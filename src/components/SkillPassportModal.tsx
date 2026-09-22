import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Share2, 
  Download, 
  X, 
  Lock, 
  Calendar, 
  ShieldCheck, 
  Code2, 
  Copy, 
  Check 
} from 'lucide-react';
import { Candidate, Evaluation } from '../types';

interface SkillPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  evaluation: Evaluation;
}

export const SkillPassportModal: React.FC<SkillPassportModalProps> = ({
  isOpen,
  onClose,
  candidate,
  evaluation,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const submissions = Object.values(candidate.submissions);
  const verifiedSubmissions = submissions.filter(s => s.status === 'demonstrated');
  const passportHash = `BHP-${candidate.id.toUpperCase()}-${Math.abs(candidate.appliedDate.split('').reduce((a, b) => a + b.charCodeAt(0), 0))}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`https://blindhire.work/passport/${passportHash}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block">
                Official Credential
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Skill Evidence Passport
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Card Layout */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-inner space-y-5 border border-indigo-800/40 relative overflow-hidden">
          {/* Subtle background seal */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-white" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Anonymous Candidate ID
              </div>
              <div className="text-2xl font-black text-white tracking-tight mt-0.5">
                {candidate.anonymousLabel}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {candidate.anonymizedProfile.educationLevel}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Verified Skills
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Ref: {passportHash}
              </div>
            </div>
          </div>

          {/* Verified Skills Section */}
          <div className="space-y-2 relative z-10 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              Demonstrated Capabilities ({verifiedSubmissions.length})
            </div>

            {verifiedSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No practical challenges completed yet. Complete challenges in the Candidate Portal to populate verified skills.
              </p>
            ) : (
              <div className="space-y-2">
                {verifiedSubmissions.map((sub) => (
                  <div key={sub.challengeId} className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs text-white">{sub.skill}</span>
                      </div>
                      <span className="text-[10px] text-slate-300">
                        {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
                      {sub.aiExplanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Passport Footer Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 relative z-10">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evidence Date: September 2026</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy-Audited Evidence</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handleCopyShareLink}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Evidence Profile'}</span>
          </button>

          <button
            onClick={handlePrintDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Passport</span>
          </button>
        </div>
      </div>
    </div>
  );
};
