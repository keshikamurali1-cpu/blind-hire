import React from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export type WorkflowStepId = 
  | 'job' 
  | 'resumes' 
  | 'blind' 
  | 'skills' 
  | 'challenges' 
  | 'verify' 
  | 'evidence';

export interface WorkflowStep {
  id: WorkflowStepId;
  label: string;
  stepNumber: number;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'job', label: 'Job', stepNumber: 1 },
  { id: 'resumes', label: 'Resumes', stepNumber: 2 },
  { id: 'blind', label: 'Blind', stepNumber: 3 },
  { id: 'skills', label: 'Skills', stepNumber: 4 },
  { id: 'challenges', label: 'Challenges', stepNumber: 5 },
  { id: 'verify', label: 'Verify', stepNumber: 6 },
  { id: 'evidence', label: 'Evidence', stepNumber: 7 },
];

interface WorkflowHeaderProps {
  jobTitle: string;
  currentStep: WorkflowStepId;
  onNavigateStep: (step: WorkflowStepId) => void;
  onExit: () => void;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  jobTitle,
  currentStep,
  onNavigateStep,
  onExit,
}) => {
  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Back button & Job title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Workflow</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-[11px] font-medium text-slate-600 block uppercase tracking-wider">
                Evaluation Workflow
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate max-w-xs sm:max-w-md">
                {jobTitle || 'New Evaluation'}
              </h1>
            </div>
          </div>

          {/* Right: Step Indicator */}
          <div className="flex items-center overflow-x-auto py-1 sm:py-0 no-scrollbar">
            <ol className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium">
              {WORKFLOW_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;

                return (
                  <li key={step.id} className="flex items-center">
                    <button
                      onClick={() => onNavigateStep(step.id)}
                      disabled={isFuture}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md transition cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                          : isCompleted
                          ? 'text-slate-700 hover:bg-slate-100 font-medium'
                          : 'text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          isCurrent
                            ? 'bg-white text-indigo-700 font-bold'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-700 font-bold'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.stepNumber}
                      </span>
                      <span className="whitespace-nowrap">{step.label}</span>
                    </button>

                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-0.5 shrink-0" />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </header>
  );
};
