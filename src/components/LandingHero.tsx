import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  EyeOff, 
  Sparkles, 
  Code2, 
  ShieldAlert, 
  ShieldCheck, 
  BarChart2, 
  Play
} from 'lucide-react';

interface LandingHeroProps {
  onStartEvaluation: () => void;
  onExploreSample: () => void;
  onStartJudgeTour: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartEvaluation,
  onExploreSample,
  onStartJudgeTour,
}) => {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Evidence-Based Technical Hiring Platform</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Hire for what candidates can demonstrate —{' '}
          <span className="text-indigo-600">not what their resume claims.</span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          BlindHire transforms job descriptions and resumes into evidence-backed skill evaluations.
          Replace keyword matching and demographic bias with objective, 5-minute practical challenges.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartEvaluation}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition flex items-center space-x-2 cursor-pointer"
          >
            <span>Start an Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreSample}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold shadow-2xs transition flex items-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Explore Sample Evaluation</span>
          </button>

          <button
            onClick={onStartJudgeTour}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Judge Demo Walkthrough</span>
          </button>
        </div>

        {/* Hero Visual Workflow Diagram */}
        <div className="pt-8 pb-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-4xl mx-auto text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <span>The BlindHire Evidence Pipeline</span>
              <span className="text-indigo-600 lowercase font-medium">vs traditional keyword screening</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {/* Step 1: Resume */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">01. Resume</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Raw candidate submissions</div>
              </div>

              {/* Step 2: Anonymous Profile */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-2 text-indigo-700">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">02. Anonymous Profile</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Names, photos, schools hidden</div>
              </div>

              {/* Step 3: Skill Claims */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2 text-amber-700">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">03. Skill Claims</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Claimed vs Supported audit</div>
              </div>

              {/* Step 4: AI Challenge */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2 text-purple-700">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-900">04. AI Challenge</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Job-specific 5-min tasks</div>
              </div>

              {/* Step 5: Verified Evidence */}
              <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-emerald-950">05. Verified Evidence</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Explainable coverage profile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Message & Responsible AI Note */}
        <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
          <div className="font-medium text-slate-700 flex items-center justify-center space-x-2">
            <span>Job-relevant evaluation</span>
            <span>•</span>
            <span>Explainable evidence</span>
            <span>•</span>
            <span>Privacy-conscious screening</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
            Job-relevant evaluation does not claim to eliminate hiring bias entirely; it ensures recruiters focus on verified skills rather than personal signals.
          </p>
        </div>
      </div>
    </div>
  );
};
