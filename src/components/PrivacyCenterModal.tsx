import React from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  FileCheck2, 
  Layers 
} from 'lucide-react';
import { Candidate } from '../types';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest block">
                Responsible AI & Bias Reduction
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                BlindHire Privacy & Data Center
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

        {/* Core Notice */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Blind Evaluation Protocol</span>
          </div>
          <p>
            BlindHire minimizes non-job-relevant demographic signals during screening.
            By evaluating candidates strictly on technical challenges and verifiable project evidence, hiring teams prevent unconscious bias stemming from names, gender, photos, or academic pedigree.
          </p>
        </div>

        {/* 3 Columns: What is Hidden vs What is Extracted vs What is Used */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Suppressed Signals */}
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <EyeOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Signals Hidden</span>
            </div>
            <ul className="text-xs text-rose-950 space-y-1 list-disc list-inside">
              <li>Candidate Legal Names</li>
              <li>Photographs & Avatars</li>
              <li>Gender & Demographic Markers</li>
              <li>University / Institution Prestige</li>
              <li>Email, Phone & Addresses</li>
              <li>Personal Social Handles</li>
            </ul>
          </div>

          {/* Extracted Signals */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Extracted Signals</span>
            </div>
            <ul className="text-xs text-blue-950 space-y-1 list-disc list-inside">
              <li>Standardized Degree Level</li>
              <li>Technical Skill Mentions</li>
              <li>Engineering Projects</li>
              <li>Production Experience Scope</li>
              <li>Supported vs Unverified Claims</li>
            </ul>
          </div>

          {/* Evaluated Evidence */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Used in Evaluation</span>
            </div>
            <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
              <li>Practical 5-Min Challenge Code</li>
              <li>Query Execution Outcomes</li>
              <li>Edge-Case Handling Logic</li>
              <li>Explainable Criteria Rubrics</li>
              <li>Candidate-Submitted Responses</li>
            </ul>
          </div>
        </div>

        {/* Candidate Audit Log (if viewing a candidate) */}
        {candidate && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Candidate Specific Redaction Audit ({candidate.anonymousLabel})</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                {candidate.personalSignalsHidden.totalSignalsSuppressed} Signals Suppressed
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              {candidate.personalSignalsHidden.auditLog?.map((log: string, i: number) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ethical AI Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Ethical AI Statement:</strong> BlindHire assists recruiters with evidence extraction and challenge evaluation. It does not replace human judgment. All hiring decisions are explicitly retained by hiring teams.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close Privacy Center
          </button>
        </div>
      </div>
    </div>
  );
};
