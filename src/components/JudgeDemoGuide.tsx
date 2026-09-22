import React from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ArrowRight
} from 'lucide-react';
import { WorkflowStepId } from './WorkflowHeader';

export interface JudgeStep {
  stepNumber: string;
  title: string;
  workflowStep: WorkflowStepId;
  tagline: string;
  description: string;
  keyTakeaway: string;
}

export const JUDGE_STEPS: JudgeStep[] = [
  {
    stepNumber: '01',
    title: 'Job Blueprint',
    workflowStep: 'job',
    tagline: 'Objective Criteria vs Keyword Searches',
    description: 'BlindHire transforms raw job descriptions into structured Technical Skills, Core Capabilities, and Experience Signals with explicit justifications for why each capability is needed.',
    keyTakeaway: 'Eliminates vague requirements and biased job specs.',
  },
  {
    stepNumber: '02',
    title: 'Candidate Resumes & Anonymization',
    workflowStep: 'resumes',
    tagline: 'Instant Automated Document Ingestion',
    description: 'Resumes are ingested and instantly queued for systematic demographic signal suppression before any recruiter review.',
    keyTakeaway: 'Ensures a uniform, objective starting line for all candidates.',
  },
  {
    stepNumber: '03',
    title: 'Blind Profiles',
    workflowStep: 'blind',
    tagline: 'Suppressing Personal & Demographic Bias',
    description: 'Names, photos, gender markers, contact details, and institutional pedigree are completely masked. Recruiters evaluate purely on normalized skills, projects, and degree tier.',
    keyTakeaway: 'Focuses evaluation on skills rather than background pedigree.',
  },
  {
    stepNumber: '04',
    title: 'Skill Claims Audit',
    workflowStep: 'skills',
    tagline: 'Claimed vs Supported vs Unverified',
    description: 'BlindHire categorizes resume claims into 3 simple statuses: 🟢 Supported (backed by project evidence), 🟡 Claimed (stated in text), and ⚪ Unverified (no corroborating project proof).',
    keyTakeaway: 'Resumes are treated as hypotheses to verify, not established truth.',
  },
  {
    stepNumber: '05',
    title: 'Challenge Generator',
    workflowStep: 'challenges',
    tagline: '5-Minute Practical Micro-Tasks',
    description: 'Core requirements are converted into short practical tasks (e.g. Java duplicate transaction detection, SQL customer aggregations) with clear, auditable criteria.',
    keyTakeaway: 'Replaces 4-hour take-home homework with focused 5-minute tasks.',
  },
  {
    stepNumber: '06',
    title: 'Skill Verification',
    workflowStep: 'verify',
    tagline: 'Interactive Demonstration & AI Evaluation',
    description: 'Experience the candidate journey: write code or queries, run tests, and receive immediate step-by-step AI evaluation with transparent pass/partial rationales.',
    keyTakeaway: 'Generates first-party verified work evidence.',
  },
  {
    stepNumber: '07',
    title: 'Evidence Profile & PDF Export',
    workflowStep: 'evidence',
    tagline: 'Evidence Coverage, Audit Trail & Shareable PDF Dossier',
    description: 'View verified work evidence, drill down into code snippets and AI rationales, and export a clean, professional PDF Dossier to share objective results with hiring managers and interview panels.',
    keyTakeaway: 'Audit-ready PDF summary for external stakeholders with bias shield.',
  },
];

interface JudgeDemoGuideProps {
  currentStepIndex: number;
  onSetStepIndex: (index: number) => void;
  onClose: () => void;
  onNavigateStep: (step: WorkflowStepId) => void;
}

export const JudgeDemoGuide: React.FC<JudgeDemoGuideProps> = ({
  currentStepIndex,
  onSetStepIndex,
  onClose,
  onNavigateStep,
}) => {
  const step = JUDGE_STEPS[currentStepIndex] || JUDGE_STEPS[0];

  const handleNext = () => {
    if (currentStepIndex < JUDGE_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      onSetStepIndex(nextIdx);
      onNavigateStep(JUDGE_STEPS[nextIdx].workflowStep);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      onSetStepIndex(prevIdx);
      onNavigateStep(JUDGE_STEPS[prevIdx].workflowStep);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block leading-tight">
              Judge Guided Tour • Step {step.stepNumber} of 07
            </span>
            <span className="text-xs font-bold text-slate-900">{step.title}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1.5 text-xs">
        <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
          {step.tagline}
        </div>
        <p className="text-slate-700 leading-relaxed font-normal">
          {step.description}
        </p>
        <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
          <strong>Key Innovation: </strong>
          <span>{step.keyTakeaway}</span>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1">
          {JUDGE_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                onSetStepIndex(i);
                onNavigateStep(JUDGE_STEPS[i].workflowStep);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStepIndex ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition cursor-pointer"
          >
            <span>{currentStepIndex < JUDGE_STEPS.length - 1 ? 'Next' : 'Finish Tour'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
