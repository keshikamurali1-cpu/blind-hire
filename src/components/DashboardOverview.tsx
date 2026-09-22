import React from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  EyeOff, 
  Code2, 
  ExternalLink 
} from 'lucide-react';
import { Evaluation } from '../types';

interface DashboardOverviewProps {
  evaluations: Evaluation[];
  activeEvaluation: Evaluation;
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onNewEvaluation: () => void;
  onViewCandidates: () => void;
  onViewEvidence: () => void;
  onViewAssessments: () => void;
  onCompareCandidates: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  evaluations,
  activeEvaluation,
  onSelectEvaluation,
  onNewEvaluation,
  onViewCandidates,
  onViewEvidence,
  onViewAssessments,
  onCompareCandidates,
}) => {
  // Aggregate metrics
  const totalCandidates = evaluations.reduce((sum, e) => sum + e.candidates.length, 0);
  
  let totalVerifiedSkills = 0;
  let totalPendingAssessments = 0;

  evaluations.forEach(ev => {
    ev.candidates.forEach(cand => {
      Object.values(cand.submissions).forEach(sub => {
        if (sub.status === 'demonstrated') {
          totalVerifiedSkills++;
        }
      });
      const submittedCount = Object.keys(cand.submissions).length;
      const totalChallenges = ev.assessments.length;
      totalPendingAssessments += Math.max(0, totalChallenges - submittedCount);
    });
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Active Workspace Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Current Active Workspace</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {activeEvaluation.jobTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeEvaluation.department} • {activeEvaluation.locationType} • {activeEvaluation.candidates.length} candidates in pipeline
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onViewCandidates}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
            <span>Blind Profiles ({activeEvaluation.candidates.length})</span>
          </button>

          <button
            onClick={onViewEvidence}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>View Evidence Matrix</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Evaluations</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{evaluations.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {evaluations.filter(e => e.status === 'in_progress').length} currently active in progress
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Candidates Evaluated</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCandidates}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <EyeOff className="w-3 h-3 mr-1" />
            <span>100% blind personal signals hidden</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Skills Verified</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalVerifiedSkills}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Demonstrated via practical task evaluation
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Assessments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalPendingAssessments}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Short 5-min challenges awaiting response
          </div>
        </div>
      </div>

      {/* Main Section: Recent Evaluations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Evaluations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an evaluation to inspect its AI Job Blueprint, blind candidate profiles, and evidence coverage.
            </p>
          </div>

          <button
            onClick={onNewEvaluation}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-2xs transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Evaluation</span>
          </button>
        </div>

        {evaluations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Start your first evidence-based evaluation</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload a job description and candidate resumes to begin extracting blueprints, blind profiles, and challenges.
            </p>
            <button
              onClick={onNewEvaluation}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Create Evaluation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {evaluations.map((item) => {
              const isActive = item.id === activeEvaluation.id;
              const totalReqs = item.blueprint.technicalSkills.length + item.blueprint.coreCapabilities.length;
              return (
                <div 
                  key={item.id}
                  className={`p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isActive ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{item.jobTitle}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                          Active In View
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status === 'completed' ? 'Completed' : 'In progress'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <span>{item.department}</span>
                      <span>•</span>
                      <span><strong>{item.candidates.length}</strong> candidates</span>
                      <span>•</span>
                      <span><strong>{totalReqs}</strong> skills detected</span>
                      <span>•</span>
                      <span><strong>{item.assessments.length}</strong> challenges generated</span>
                    </div>

                    {/* Detected Skills Preview Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.blueprint.technicalSkills.slice(0, 5).map(skill => (
                        <span key={skill.name} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                          {skill.name}
                        </span>
                      ))}
                      {item.blueprint.technicalSkills.length > 5 && (
                        <span className="px-1.5 py-0.5 rounded text-[11px] text-slate-400">
                          +{item.blueprint.technicalSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-start md:self-auto">
                    <button
                      onClick={() => onSelectEvaluation(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isActive ? 'Selected' : 'Load Workspace'}
                    </button>

                    <button
                      onClick={() => {
                        onSelectEvaluation(item);
                        onViewEvidence();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Evidence</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison and Fast-Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Multi-Candidate Evidence Comparison</h4>
            <p className="text-xs text-slate-500 mt-1">
              Compare Candidate 014, Candidate 027, and Candidate 031 side-by-side across demonstrated skills and requirement gaps.
            </p>
            <button
              onClick={onCompareCandidates}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Open Comparison Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">Evidence Challenge Studio</h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect or edit the practical 5-minute challenges (Java duplicate checker, SQL order aggregation, Python retry limiter).
            </p>
            <button
              onClick={onViewAssessments}
              className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage Challenges</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
