import React from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  Layers, 
  FileCheck2, 
  Users, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  Lock,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'evaluations' | 'candidates' | 'assessments' | 'evidence' | 'comparison' | 'candidate_portal';
  setActiveTab: (tab: any) => void;
  openNewEvaluationModal: () => void;
  openPrivacyCenter: () => void;
  isJudgeDemoActive: boolean;
  toggleJudgeDemo: () => void;
  isSampleActive: boolean;
  loadSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openNewEvaluationModal,
  openPrivacyCenter,
  isJudgeDemoActive,
  toggleJudgeDemo,
  isSampleActive,
  loadSampleData
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner for Privacy & Demo Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-emerald-400 font-medium">
            <Lock className="w-3.5 h-3.5 mr-1.5 inline" />
            <span>Blind Evaluation Active</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Personal signals are excluded from evaluation views to focus solely on demonstrated skills.
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openPrivacyCenter}
            className="text-slate-300 hover:text-white underline text-[11px] cursor-pointer"
          >
            Privacy Audit
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={toggleJudgeDemo}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
              isJudgeDemoActive 
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' 
                : 'bg-indigo-950 text-indigo-200 hover:bg-indigo-900 border border-indigo-700'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>{isJudgeDemoActive ? 'Exit Demo Guide' : 'Judge Demo Tour'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-none"
            >
              {/* Custom SVG Logo combining Blind Eye Shield + Checkmark */}
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-500/20 group-hover:bg-indigo-700 transition">
                <div className="relative flex items-center justify-center">
                  <EyeOff className="w-4 h-4 opacity-75" />
                  <CheckCircle2 className="w-3 h-3 absolute -bottom-1 -right-1 text-emerald-300 bg-indigo-900 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">BlindHire</span>
                  {isSampleActive && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      Sample Evaluation
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block leading-none">
                  From Resume Claims to Verified Skill Evidence
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('evaluations')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'evaluations'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Evaluations
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Blind Candidates
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'assessments'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Challenge Studio
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'evidence'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Evidence Profile
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Candidate Comparison
            </button>
          </nav>

          {/* Action Area: Switch to Candidate Portal & New Evaluation CTA */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveTab(activeTab === 'candidate_portal' ? 'overview' : 'candidate_portal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'candidate_portal'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>{activeTab === 'candidate_portal' ? 'Back to Recruiter' : 'Candidate Portal'}</span>
            </button>

            <button
              onClick={openNewEvaluationModal}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Evaluation</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
