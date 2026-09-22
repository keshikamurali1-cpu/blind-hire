import React from 'react';
import { 
  Plus, 
  Briefcase, 
  Users, 
  FileCheck2, 
  ArrowRight, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Evaluation } from '../types';

interface EvaluationsListScreenProps {
  evaluations: Evaluation[];
  onCreateEvaluation: () => void;
  onOpenEvaluation: (id: string) => void;
}

export const EvaluationsListScreen: React.FC<EvaluationsListScreenProps> = ({
  evaluations,
  onCreateEvaluation,
  onOpenEvaluation,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Role Evaluations
          </h1>
          <p className="text-sm text-slate-600">
            Manage your evidence-based hiring pipelines.
          </p>
        </div>

        <button
          onClick={onCreateEvaluation}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Evaluation</span>
        </button>
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No evaluations yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Create your first evidence-based hiring evaluation.
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
        <div className="space-y-4">
          {evaluations.map((ev) => {
            const reqCount = 
              ev.blueprint.technicalSkills.length + 
              ev.blueprint.coreCapabilities.length + 
              ev.blueprint.experienceSignals.length;

            return (
              <div
                key={ev.id}
                onClick={() => onOpenEvaluation(ev.id)}
                className="group bg-white hover:bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {ev.jobTitle}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      ev.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {ev.status === 'completed' ? 'Completed' : 'In progress'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {ev.department} • {ev.locationType}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.candidates.length} blind candidates</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reqCount} requirements</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Created {new Date(ev.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEvaluation(ev.id);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
                  >
                    <span>Open Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
