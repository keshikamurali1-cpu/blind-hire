import React from 'react';
import { Plus, Sparkles, ArrowRight, ShieldCheck, Briefcase, Users, FileCheck2, Clock } from 'lucide-react';
import { Evaluation, UserSession } from '../types';

interface HomeScreenProps {
  evaluations: Evaluation[];
  currentUser?: UserSession | null;
  onCreateEvaluation: () => void;
  onExploreSample: () => void;
  onOpenEvaluation: (evaluationId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  evaluations,
  currentUser,
  onCreateEvaluation,
  onExploreSample,
  onOpenEvaluation,
}) => {
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Sarah';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Good morning, {userName}</span>
          <span className="text-2xl">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-normal">
          What would you like to do?
        </p>
      </div>

      {/* Primary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Large Primary Action Card */}
        <div
          onClick={onCreateEvaluation}
          className="group text-left p-6 sm:p-7 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-indigo-400 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between h-52 space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Create a New Evaluation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xs">
              Start with a job description and let BlindHire build the evaluation.
            </p>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 group-hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Evaluation</span>
            </button>
          </div>
        </div>

        {/* Secondary Sample Evaluation Card */}
        <div
          onClick={onExploreSample}
          className="group text-left p-6 sm:p-7 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-amber-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between h-52 space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Explore Sample Evaluation
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Judge Demo
              </span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xs">
              Take the 2-minute tour with pre-loaded candidate evidence and micro-challenges.
            </p>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 group-hover:bg-amber-50 text-slate-700 group-hover:text-amber-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 transition"
            >
              <span>Explore Sample Tour</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Methodology Notice */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <strong className="text-slate-800">Evidence Over Pedigree: </strong>
            <span>Personal signals are hidden so recruiters evaluate demonstrated capabilities.</span>
          </div>
        </div>
        <div className="shrink-0 text-slate-500 font-medium">
          6-Step Guided Flow
        </div>
      </div>

      {/* Recent Evaluations Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Evaluations</h2>
          {evaluations.length > 0 && (
            <span className="text-xs text-slate-500 font-medium">
              {evaluations.length} total
            </span>
          )}
        </div>

        {evaluations.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 px-6 bg-white border border-dashed border-slate-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No evaluations yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Create your first evaluation to get started.
            </p>
            <div className="pt-2">
              <button
                onClick={onCreateEvaluation}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Evaluation</span>
              </button>
            </div>
          </div>
        ) : (
          /* Evaluations Cards List */
          <div className="space-y-3">
            {evaluations.map((ev) => {
              const reqCount = 
                ev.blueprint.technicalSkills.length + 
                ev.blueprint.coreCapabilities.length + 
                ev.blueprint.experienceSignals.length;

              const statusBadge = 
                ev.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200';

              return (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvaluation(ev.id)}
                  className="group bg-white hover:bg-slate-50/70 p-5 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {ev.jobTitle}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                        {ev.status === 'completed' ? 'Completed' : 'In progress'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.candidates.length} candidates</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{reqCount} skills evaluated</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(ev.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEvaluation(ev.id);
                      }}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 group-hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
