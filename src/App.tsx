import React, { useState } from 'react';
import { SAMPLE_EVALUATION, SECONDARY_SAMPLE_EVALUATION } from './data/sampleEvaluation';
import { 
  Evaluation, 
  Candidate, 
  CandidateSubmission, 
  AssessmentChallenge, 
  JobBlueprint, 
  UserSession 
} from './types';
import { Sidebar, MainNavTab } from './components/Sidebar';
import { WorkflowHeader, WorkflowStepId } from './components/WorkflowHeader';
import { HomeScreen } from './components/HomeScreen';
import { Step1AddJob } from './components/Step1AddJob';
import { Step2AddResumes } from './components/Step2AddResumes';
import { Step3BlindProfiles } from './components/Step3BlindProfiles';
import { Step4SkillClaims } from './components/Step4SkillClaims';
import { Step5ChallengeGenerator } from './components/Step5ChallengeGenerator';
import { Step6CandidateVerification } from './components/Step6CandidateVerification';
import { Step7EvidenceResults } from './components/Step7EvidenceResults';
import { CandidateComparisonScreen } from './components/CandidateComparisonScreen';
import { EvaluationsListScreen } from './components/EvaluationsListScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { JudgeDemoGuide } from './components/JudgeDemoGuide';
import { LandingPage } from './components/LandingPage';
import { SignInScreen } from './components/SignInScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { RecruiterOnboarding } from './components/RecruiterOnboarding';
import { CandidateOnboarding } from './components/CandidateOnboarding';
import { CandidatePortalScreen } from './components/CandidatePortalScreen';
import { SkillPassportScreen } from './components/SkillPassportScreen';
import { PrivacyCenterScreen } from './components/PrivacyCenterScreen';
import { Menu, ShieldCheck } from 'lucide-react';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [authView, setAuthView] = useState<'landing' | 'sign_in' | 'sign_up'>('landing');
  const [showSkillPassport, setShowSkillPassport] = useState(false);

  // Evaluations list
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    SAMPLE_EVALUATION,
    SECONDARY_SAMPLE_EVALUATION,
  ]);
  const [activeEvaluationId, setActiveEvaluationId] = useState<string>(SAMPLE_EVALUATION.id);

  // Global navigation tab
  const [mainTab, setMainTab] = useState<MainNavTab | 'workflow'>('home');

  // Multi-step workflow state
  const [workflowStep, setWorkflowStep] = useState<WorkflowStepId>('job');

  // Currently selected candidate for deep dives
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    SAMPLE_EVALUATION.candidates[0].id
  );

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Judge Demo Tour state
  const [isJudgeTourActive, setIsJudgeTourActive] = useState(false);
  const [judgeStepIndex, setJudgeStepIndex] = useState(0);

  // Active evaluation helper
  const activeEvaluation = 
    evaluations.find((e) => e.id === activeEvaluationId) || evaluations[0];

  const activeCandidate = 
    activeEvaluation.candidates.find((c) => c.id === selectedCandidateId) || 
    activeEvaluation.candidates[0];

  // Auth Handlers
  const handleSignInSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setShowSkillPassport(false);
    setMainTab('home');
  };

  const handleSignUpSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setShowSkillPassport(false);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthView('landing');
    setShowSkillPassport(false);
    setIsJudgeTourActive(false);
  };

  // Start new evaluation
  const handleStartNewEvaluation = () => {
    const newEvalId = `eval-${Date.now()}`;
    const newEvaluation: Evaluation = {
      id: newEvalId,
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      locationType: 'Hybrid',
      createdAt: new Date().toISOString(),
      status: 'draft',
      jobDescription: '',
      blueprint: {
        summary: '',
        technicalSkills: [],
        coreCapabilities: [],
        experienceSignals: [],
      },
      candidates: [],
      assessments: [],
    };

    setEvaluations((prev) => [newEvaluation, ...prev]);
    setActiveEvaluationId(newEvalId);
    setWorkflowStep('job');
    setMainTab('workflow');
  };

  // Explore sample evaluation (for judges & fast onboarding)
  const handleExploreSample = () => {
    // If not signed in, sign in as Demo Recruiter immediately
    if (!currentUser) {
      setCurrentUser({
        id: 'usr-demo-judge',
        name: 'Sarah Jenkins',
        email: 'judge.demo@blindhire.test',
        role: 'recruiter',
        organization: 'Vertex Cloud Systems',
        jobTitle: 'Head of Engineering Talent',
        onboardingComplete: true,
      });
    }
    setEvaluations([SAMPLE_EVALUATION, SECONDARY_SAMPLE_EVALUATION]);
    setActiveEvaluationId(SAMPLE_EVALUATION.id);
    setSelectedCandidateId(SAMPLE_EVALUATION.candidates[0].id);
    setWorkflowStep('job');
    setMainTab('workflow');
    setIsJudgeTourActive(true);
    setJudgeStepIndex(0);
  };

  // Open existing evaluation
  const handleOpenEvaluation = (id: string) => {
    setActiveEvaluationId(id);
    const target = evaluations.find((e) => e.id === id);
    if (target && target.candidates.length > 0) {
      setSelectedCandidateId(target.candidates[0].id);
    }
    setWorkflowStep('evidence');
    setMainTab('workflow');
  };

  // Update evaluation job & blueprint (Step 1)
  const handleUpdateJobBlueprint = (jobTitle: string, blueprint: JobBlueprint) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.id === activeEvaluationId
          ? { ...e, jobTitle, blueprint, status: 'in_progress' }
          : e
      )
    );
  };

  // Update evaluation candidates (Step 2 & 3)
  const handleUpdateCandidates = (candidates: Candidate[]) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.id === activeEvaluationId ? { ...e, candidates } : e
      )
    );
    if (candidates.length > 0 && !selectedCandidateId) {
      setSelectedCandidateId(candidates[0].id);
    }
  };

  // Update challenges (Step 5)
  const handleUpdateChallenges = (assessments: AssessmentChallenge[]) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.id === activeEvaluationId ? { ...e, assessments } : e
      )
    );
  };

  // Update candidate submission (Step 6 / Candidate Portal)
  const handleCandidateSubmission = (candidateId: string, submission: CandidateSubmission) => {
    setEvaluations((prev) =>
      prev.map((e) => {
        if (e.id !== activeEvaluationId) return e;
        const updatedCandidates = e.candidates.map((c) => {
          if (c.id !== candidateId) return c;
          return {
            ...c,
            submissions: {
              ...(c.submissions || {}),
              [submission.challengeId]: submission,
            },
          };
        });
        return { ...e, candidates: updatedCandidates };
      })
    );
  };

  // Reset sample data
  const handleResetSampleData = () => {
    setEvaluations([SAMPLE_EVALUATION, SECONDARY_SAMPLE_EVALUATION]);
    setActiveEvaluationId(SAMPLE_EVALUATION.id);
    setSelectedCandidateId(SAMPLE_EVALUATION.candidates[0].id);
    setWorkflowStep('job');
    setMainTab('home');
  };

  // ==========================================
  // UN-AUTHENTICATED SCREENS (Landing, Sign In, Sign Up)
  // ==========================================
  if (!currentUser) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onSignInClick={() => setAuthView('sign_in')}
          onSignUpClick={() => setAuthView('sign_up')}
          onExploreSample={handleExploreSample}
        />
      );
    }

    if (authView === 'sign_in') {
      return (
        <SignInScreen
          onSignInSuccess={handleSignInSuccess}
          onNavigateToSignUp={() => setAuthView('sign_up')}
          onBackToHome={() => setAuthView('landing')}
          onExploreSample={handleExploreSample}
        />
      );
    }

    if (authView === 'sign_up') {
      return (
        <SignUpScreen
          onSignUpSuccess={handleSignUpSuccess}
          onNavigateToSignIn={() => setAuthView('sign_in')}
          onBackToHome={() => setAuthView('landing')}
        />
      );
    }
  }

  // ==========================================
  // ONBOARDING SCREEN (If onboarding incomplete)
  // ==========================================
  if (currentUser && !currentUser.onboardingComplete) {
    if (currentUser.role === 'recruiter') {
      return (
        <RecruiterOnboarding
          user={currentUser}
          onComplete={(updated) => setCurrentUser(updated)}
        />
      );
    } else {
      return (
        <CandidateOnboarding
          user={currentUser}
          onComplete={(updated) => setCurrentUser(updated)}
        />
      );
    }
  }

  // ==========================================
  // CANDIDATE WORKSPACE
  // ==========================================
  if (currentUser && currentUser.role === 'candidate') {
    if (showSkillPassport) {
      return (
        <SkillPassportScreen
          candidate={activeCandidate}
          onBack={() => setShowSkillPassport(false)}
        />
      );
    }

    return (
      <CandidatePortalScreen
        user={currentUser}
        evaluation={activeEvaluation}
        onOpenSkillPassport={() => setShowSkillPassport(true)}
        onSignOut={handleSignOut}
        onCandidateSubmission={handleCandidateSubmission}
      />
    );
  }

  // ==========================================
  // RECRUITER WORKSPACE
  // ==========================================
  if (showSkillPassport) {
    return (
      <SkillPassportScreen
        candidate={activeCandidate}
        onBack={() => setShowSkillPassport(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        activeTab={mainTab}
        onSelectTab={(tab) => {
          setMainTab(tab);
          if (tab === 'home') {
            setIsJudgeTourActive(false);
          }
        }}
        onExploreSample={handleExploreSample}
        isOpenMobile={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenSkillPassport={() => setShowSkillPassport(true)}
      />

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 text-slate-700 hover:text-slate-900 rounded-lg"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">BlindHire</span>
          </div>
          <button
            onClick={handleExploreSample}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Sample
          </button>
        </div>

        {/* Workflow Stepper Header (Only shown when inside evaluation workflow) */}
        {mainTab === 'workflow' && (
          <WorkflowHeader
            jobTitle={activeEvaluation.jobTitle}
            currentStep={workflowStep}
            onNavigateStep={(step) => setWorkflowStep(step)}
            onExit={() => setMainTab('home')}
          />
        )}

        {/* Dynamic Screen Rendering based on state */}
        <main className="flex-1 pb-16">
          {/* A. Recruiter Workspace Home Screen */}
          {mainTab === 'home' && (
            <HomeScreen
              evaluations={evaluations}
              currentUser={currentUser}
              onCreateEvaluation={handleStartNewEvaluation}
              onExploreSample={handleExploreSample}
              onOpenEvaluation={handleOpenEvaluation}
            />
          )}

          {/* B. Step 1: Add Job Description */}
          {mainTab === 'workflow' && workflowStep === 'job' && (
            <Step1AddJob
              initialJobTitle={activeEvaluation.jobTitle}
              initialJobDescription={activeEvaluation.jobDescription}
              initialBlueprint={activeEvaluation.blueprint}
              onSaveJobAndBlueprint={(jobTitle, _desc, blueprint) => {
                handleUpdateJobBlueprint(jobTitle, blueprint);
                setWorkflowStep('resumes');
              }}
              onExit={() => setMainTab('home')}
            />
          )}

          {/* C. Step 2: Add Resumes */}
          {mainTab === 'workflow' && workflowStep === 'resumes' && (
            <Step2AddResumes
              candidates={activeEvaluation.candidates}
              blueprint={activeEvaluation.blueprint}
              onUpdateCandidates={handleUpdateCandidates}
              onContinue={() => setWorkflowStep('blind')}
              onBack={() => setWorkflowStep('job')}
            />
          )}

          {/* D. Step 3: Blind Profiles */}
          {mainTab === 'workflow' && workflowStep === 'blind' && (
            <Step3BlindProfiles
              candidates={activeEvaluation.candidates.length > 0 ? activeEvaluation.candidates : SAMPLE_EVALUATION.candidates}
              onContinue={() => setWorkflowStep('skills')}
              onBack={() => setWorkflowStep('resumes')}
            />
          )}

          {/* E. Step 4: Skill Claims */}
          {mainTab === 'workflow' && workflowStep === 'skills' && (
            <Step4SkillClaims
              candidates={activeEvaluation.candidates.length > 0 ? activeEvaluation.candidates : SAMPLE_EVALUATION.candidates}
              onContinue={() => setWorkflowStep('challenges')}
              onBack={() => setWorkflowStep('blind')}
            />
          )}

          {/* F. Step 5: Challenges */}
          {mainTab === 'workflow' && workflowStep === 'challenges' && (
            <Step5ChallengeGenerator
              challenges={activeEvaluation.assessments.length > 0 ? activeEvaluation.assessments : SAMPLE_EVALUATION.assessments}
              blueprint={activeEvaluation.blueprint}
              onUpdateChallenges={handleUpdateChallenges}
              onContinue={() => setWorkflowStep('verify')}
              onBack={() => setWorkflowStep('skills')}
            />
          )}

          {/* G. Step 6: Verify Skills */}
          {mainTab === 'workflow' && workflowStep === 'verify' && (
            <Step6CandidateVerification
              challenges={activeEvaluation.assessments.length > 0 ? activeEvaluation.assessments : SAMPLE_EVALUATION.assessments}
              activeCandidate={activeCandidate}
              candidates={activeEvaluation.candidates.length > 0 ? activeEvaluation.candidates : SAMPLE_EVALUATION.candidates}
              onSelectCandidate={(candId: string) => setSelectedCandidateId(candId)}
              onCandidateSubmission={handleCandidateSubmission}
              onContinue={() => setWorkflowStep('evidence')}
              onBack={() => setWorkflowStep('challenges')}
            />
          )}

          {/* H. Step 7: Evidence Results */}
          {mainTab === 'workflow' && workflowStep === 'evidence' && (
            <Step7EvidenceResults
              evaluation={activeEvaluation}
              activeCandidate={activeCandidate}
              candidates={activeEvaluation.candidates.length > 0 ? activeEvaluation.candidates : SAMPLE_EVALUATION.candidates}
              onSelectCandidate={(candId) => setSelectedCandidateId(candId)}
              onCompareCandidates={() => setMainTab('candidates')}
              onBack={() => setWorkflowStep('verify')}
              currentUser={currentUser}
            />
          )}

          {/* Sidebar Tab: Evaluations */}
          {mainTab === 'evaluations' && (
            <EvaluationsListScreen
              evaluations={evaluations}
              onCreateEvaluation={handleStartNewEvaluation}
              onOpenEvaluation={handleOpenEvaluation}
            />
          )}

          {/* Sidebar Tab: Candidates (Comparison View) */}
          {mainTab === 'candidates' && (
            <CandidateComparisonScreen
              evaluation={activeEvaluation}
              onSelectCandidateEvidence={(candId) => {
                setSelectedCandidateId(candId);
                setMainTab('workflow');
                setWorkflowStep('evidence');
              }}
              onBackToHome={() => setMainTab('home')}
              currentUser={currentUser}
            />
          )}

          {/* Sidebar Tab: Assessments */}
          {mainTab === 'assessments' && (
            <Step5ChallengeGenerator
              challenges={activeEvaluation.assessments.length > 0 ? activeEvaluation.assessments : SAMPLE_EVALUATION.assessments}
              blueprint={activeEvaluation.blueprint}
              onUpdateChallenges={handleUpdateChallenges}
              onContinue={() => {
                setMainTab('workflow');
                setWorkflowStep('verify');
              }}
              onBack={() => setMainTab('home')}
            />
          )}

          {/* Sidebar Tab: Evidence (Direct Access) */}
          {mainTab === 'evidence' && (
            <Step7EvidenceResults
              evaluation={activeEvaluation}
              activeCandidate={activeCandidate}
              candidates={activeEvaluation.candidates.length > 0 ? activeEvaluation.candidates : SAMPLE_EVALUATION.candidates}
              onSelectCandidate={(candId) => setSelectedCandidateId(candId)}
              onCompareCandidates={() => setMainTab('candidates')}
              onBack={() => setMainTab('home')}
              currentUser={currentUser}
            />
          )}

          {/* Sidebar Tab: Privacy Center */}
          {mainTab === 'privacy' && (
            <PrivacyCenterScreen onBack={() => setMainTab('home')} />
          )}

          {/* Sidebar Tab: Settings */}
          {mainTab === 'settings' && (
            <SettingsScreen onResetSampleData={handleResetSampleData} />
          )}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">BlindHire</span>
              <span>•</span>
              <span>From Resume Claims to Verified Skill Evidence</span>
            </div>
            <div className="text-slate-400">
              Job-relevant evaluation • Explainable evidence • Bias-free screening
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Judge Demo Guide */}
      {isJudgeTourActive && (
        <JudgeDemoGuide
          currentStepIndex={judgeStepIndex}
          onSetStepIndex={setJudgeStepIndex}
          onClose={() => setIsJudgeTourActive(false)}
          onNavigateStep={(step) => {
            setMainTab('workflow');
            setWorkflowStep(step);
          }}
        />
      )}
    </div>
  );
}
