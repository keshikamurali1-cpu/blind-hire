export type EvidenceStatus = 'demonstrated' | 'partial' | 'unverified' | 'gap';

export type ClaimStatus = 'claimed' | 'supported' | 'unverified';

export type UserRole = 'recruiter' | 'candidate';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  jobTitle?: string;
  onboardingComplete: boolean;
  usageIntent?: string;
}

export interface JobRequirement {
  id: string;
  name: string;
  category: 'technical' | 'core_capability' | 'experience_signal';
  required: boolean;
  explanation: string;
  level?: 'Foundational' | 'Intermediate' | 'Advanced';
}

export interface JobBlueprint {
  technicalSkills: JobRequirement[];
  coreCapabilities: JobRequirement[];
  experienceSignals: JobRequirement[];
  summary: string;
}

export interface SkillClaim {
  skill: string;
  status: ClaimStatus;
  evidenceSnippet?: string;
  category?: string;
}

export interface PersonalSignalsAudit {
  namesSuppressed: string[];
  genderAndDemographicsSuppressed: string[];
  photosSuppressed: boolean;
  institutionsAnonymized: string[];
  contactInfoSuppressed: string[];
  locationsSuppressed: string[];
  totalSignalsSuppressed: number;
  auditLog?: string[];
}

export interface CandidateSubmission {
  challengeId: string;
  skill: string;
  codeOrAnswer: string;
  submittedAt: string;
  status: EvidenceStatus;
  aiExplanation: string;
  executionOutput?: string;
}

export interface Candidate {
  id: string; // e.g. "Candidate 014"
  anonymousLabel: string;
  appliedDate: string;
  rawResumeText?: string;
  anonymizedProfile: {
    headline: string;
    educationLevel: string; // e.g. "B.Tech Information Technology"
    relevantExperience: string[];
    programmingExperience: string;
    domainExposure: string[];
  };
  extractedSkills: SkillClaim[];
  personalSignalsHidden: PersonalSignalsAudit;
  submissions: Record<string, CandidateSubmission>; // challengeId -> submission
  notes?: string;
}

export interface AssessmentChallenge {
  id: string;
  skill: string;
  title: string;
  taskType: 'practical_coding' | 'system_query' | 'scenario_design' | 'api_logic';
  timeLimitMinutes: number;
  difficulty: 'Entry' | 'Intermediate' | 'Advanced';
  description: string;
  starterCode?: string;
  language?: string;
  evaluationCriteria: string[];
  sampleSolutionPrompt?: string;
}

export interface EvidenceMatrixRow {
  capability: string;
  category: 'technical' | 'core_capability';
  resumeClaim: ClaimStatus;
  challengeStatus: 'completed' | 'attempted' | 'not_attempted';
  evidenceStatus: EvidenceStatus;
  explanation: string;
  jobRequirementWhy: string;
  resumeEvidenceSnippet: string;
  challengePrompt: string;
  candidateResponseSnippet: string;
  aiEvaluationReason: string;
}

export interface Evaluation {
  id: string;
  jobTitle: string;
  department: string;
  locationType: 'Remote' | 'Hybrid' | 'On-site';
  jobDescription: string;
  blueprint: JobBlueprint;
  candidates: Candidate[];
  assessments: AssessmentChallenge[];
  createdAt: string;
  status: 'draft' | 'in_progress' | 'completed';
}
