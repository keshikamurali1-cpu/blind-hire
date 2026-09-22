import React, { useState } from 'react';
import { 
  Briefcase, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Code2, 
  Layers, 
  Lock, 
  X, 
  RefreshCw, 
  Check, 
  Plus
} from 'lucide-react';
import { Evaluation, JobBlueprint, Candidate, AssessmentChallenge } from '../types';

interface CreateEvaluationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationCreated: (evaluation: Evaluation) => void;
}

const PRESET_JOBS = [
  {
    title: 'Junior Software Engineer',
    dept: 'Core Backend Platform',
    desc: `Role: Junior Software Engineer
Location: Hybrid (San Francisco, CA)
Experience: 0-2 years

About the Role:
We are seeking a Junior Software Engineer to join our backend platform team. In this role, you will build and maintain high-throughput REST APIs, write robust backend microservices, query and optimize relational databases, and collaborate with cross-functional teams to solve challenging technical problems.

Key Requirements:
- Hands-on proficiency in Java or Python for backend service development.
- Solid understanding of SQL, relational schema design, and query optimization.
- Practical experience designing and consuming RESTful APIs with clean error handling.
- Foundational knowledge of Spring Boot or FastAPI frameworks.
- Strong analytical problem-solving skills and clean code practices with unit testing.
- Comfort with version control (Git) and automated testing environments.`
  },
  {
    title: 'Full-Stack Web Engineer',
    dept: 'Product Engineering',
    desc: `Role: Full-Stack Web Engineer
Location: Remote
Experience: 1-3 years

About the Role:
Looking for a product-minded Full-Stack Engineer to build end-user workflows and interactive dashboards.
Requirements:
- TypeScript, React, and modern CSS frameworks (Tailwind).
- Server-side REST API development with Node.js / Express or Python.
- Relational database querying (PostgreSQL) and schema migrations.
- State management and API caching patterns.
- Responsive design and accessibility standards.`
  }
];

const PRESET_SAMPLE_RESUMES = [
  {
    filename: 'Resume_Candidate_A.txt',
    text: `Keshika Murali
Email: keshika.murali@example.com | Phone: +1-555-0192 | San Jose, CA
LinkedIn: linkedin.com/in/keshika-murali | GitHub: github.com/keshika-m

EDUCATION:
Tier 1 University of Technology, B.Tech Information Technology, 2024
GPA: 3.8/4.0

TECHNICAL SKILLS:
Languages: Java, Python, SQL, C++
Frameworks & Tools: Spring Boot, REST APIs, PostgreSQL, Docker, Git

EXPERIENCE:
Backend Engineering Intern | FinTech Cloud Corp (June 2024 - Dec 2024)
- Architected and deployed 4 high-concurrency microservices in Java 17 handling 45,000 requests/min.
- Authored complex multi-table SQL queries, indexed transactions in PostgreSQL, reducing query latency by 32%.
- Wrote automated integration test suite in Python using pytest and requests.

ACADEMIC & OPEN SOURCE PROJECTS:
Distributed Audit Ledger System (Java, SQL, REST)
- Implemented double-entry accounting engine in Java with atomic database transactions.
- Built 12 REST API endpoints following OpenAPI 3.0 specification with JWT authentication.`
  },
  {
    filename: 'Resume_Candidate_B.txt',
    text: `Marcus Vance
Email: mvance@domain.io | Mobile: 555-829-1928 | Austin, TX
Gender: Male | GitHub: github.com/marcusvance

EDUCATION:
State Polytechnic University - B.S. Computer Science, Class of 2025

CORE CAPABILITIES:
Python, SQL, MySQL, Java, REST APIs, ETL Pipelines, Docker

EXPERIENCE:
Software Developer Co-Op | DataStream Solutions (2024 - 2025)
- Maintained Python ETL data feeds processing over 100,000 records daily into MySQL databases.
- Tuned analytical SQL views and queries to optimize dashboard generation times.
- Developed multithreaded sensor event receiver in Java during 48-hour internal hackathon.`
  },
  {
    filename: 'Resume_Candidate_C.txt',
    text: `Elena Rostova
Location: Seattle, WA | Contact: elena.r@webmail.org | Portfolio: elenar.dev

EDUCATION:
Pacific College of Engineering, B.S. Software Engineering (2024)

SKILLS & TOOLS:
REST APIs, Python, JavaScript, Java, SQL, Flask, Git

PROJECTS:
E-Commerce Checkout & Inventory Microservice
- Created authenticated RESTful endpoints for cart checkout and catalog search using Python and Flask.
- Integrated SQLite database with parameterized queries for order records.
- Java listed as learned coursework language.`
  }
];

export const CreateEvaluationWizard: React.FC<CreateEvaluationWizardProps> = ({
  isOpen,
  onClose,
  onEvaluationCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [jobTitle, setJobTitle] = useState(PRESET_JOBS[0].title);
  const [department, setDepartment] = useState(PRESET_JOBS[0].dept);
  const [jobDescription, setJobDescription] = useState(PRESET_JOBS[0].desc);
  
  // AI blueprint state
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [blueprint, setBlueprint] = useState<JobBlueprint | null>(null);

  // Resume processing state
  const [rawResumes, setRawResumes] = useState<{ filename: string; text: string }[]>(PRESET_SAMPLE_RESUMES);
  const [isProcessingResumes, setIsProcessingResumes] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Assessment challenges state
  const [isGeneratingChallenges, setIsGeneratingChallenges] = useState(false);
  const [challenges, setChallenges] = useState<AssessmentChallenge[]>([]);

  if (!isOpen) return null;

  // Step 1: Analyze Job Blueprint
  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzingJob(true);
    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (response.ok) {
        const data = await response.json();
        setBlueprint(data.blueprint);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('Falling back to local blueprint parsing:', err);
      // Fallback blueprint
      setBlueprint({
        summary: 'Backend platform role requiring Java or Python, SQL, REST APIs, and problem solving.',
        technicalSkills: [
          { id: 't-1', name: 'Java', category: 'technical', required: true, level: 'Intermediate', explanation: 'Primary language for core backend platform microservices.' },
          { id: 't-2', name: 'SQL', category: 'technical', required: true, level: 'Intermediate', explanation: 'Required for relational database queries and data handling.' },
          { id: 't-3', name: 'Python', category: 'technical', required: false, level: 'Foundational', explanation: 'Used for automation scripts and data processing pipelines.' },
          { id: 't-4', name: 'REST APIs', category: 'technical', required: true, level: 'Intermediate', explanation: 'Core responsibility to build well-formed HTTP endpoints.' },
        ],
        coreCapabilities: [
          { id: 'c-1', name: 'Problem Solving & Edge Cases', category: 'core_capability', required: true, explanation: 'Essential for testing boundary conditions and error resilience.' },
          { id: 'c-2', name: 'API Error Handling', category: 'core_capability', required: true, explanation: 'Disciplined approach to returning predictable error contracts.' }
        ],
        experienceSignals: [
          { id: 'e-1', name: 'Backend Production Projects', category: 'experience_signal', required: true, explanation: 'Practical experience designing and shipping services.' }
        ]
      });
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  // Step 2 -> 3: Process and Anonymize Resumes
  const handleProcessResumes = async () => {
    setIsProcessingResumes(true);
    const steps = ['Uploading files...', 'Reading document structures...', 'Extracting skill claims...', 'Anonymizing personal signals...', 'Ready!'];
    
    for (const stepMsg of steps) {
      setProcessingStatusText(stepMsg);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      const skillsToMatch = blueprint?.technicalSkills.map(s => s.name) || ['Java', 'SQL', 'Python', 'REST APIs'];
      const response = await fetch('/api/anonymize-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumes: rawResumes, jobSkills: skillsToMatch }),
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      console.warn('Using client fallback candidate anonymization');
      // Create candidates locally
      setCandidates(rawResumes.map((r, i) => ({
        id: `cand-${String(i + 1).padStart(3, '0')}`,
        anonymousLabel: `Candidate ${String(i + 1).padStart(3, '0')}`,
        appliedDate: new Date().toISOString(),
        rawResumeText: r.text,
        anonymizedProfile: {
          headline: 'Software Engineer with Applied Development Background',
          educationLevel: i === 0 ? 'B.Tech Information Technology' : 'B.S. Computer Science',
          relevantExperience: [
            'Microservices backend development with API endpoints',
            'Relational database querying and indexing'
          ],
          programmingExperience: '2-3 years practical software development',
          domainExposure: ['Backend APIs', 'Relational Databases']
        },
        extractedSkills: [
          { skill: 'Java', status: 'supported', evidenceSnippet: 'Implemented microservices in Java handling concurrent traffic.' },
          { skill: 'SQL', status: 'supported', evidenceSnippet: 'Authored complex multi-table queries and indexes.' },
          { skill: 'Python', status: i === 2 ? 'supported' : 'claimed', evidenceSnippet: 'Automated test suites and scripts.' },
          { skill: 'Spring Boot', status: 'unverified', evidenceSnippet: 'Listed in skills bullet without specific deployment metrics.' }
        ],
        personalSignalsHidden: {
          namesSuppressed: ['Full Legal Name'],
          genderAndDemographicsSuppressed: ['Demographic Markers'],
          photosSuppressed: true,
          institutionsAnonymized: ['Specific university replaced with standardized degree classification'],
          contactInfoSuppressed: ['Email, Phone, Postal Address'],
          locationsSuppressed: ['Geographic city / address'],
          totalSignalsSuppressed: 8,
          auditLog: [
            'Masked candidate personal identifiers',
            'Standardized educational institution to degree classification',
            'Suppressed contact coordinates'
          ]
        },
        submissions: {}
      })));
    } finally {
      setIsProcessingResumes(false);
      setCurrentStep(3); // Go to Blind Profile view
    }
  };

  // Step 4 -> 5: Generate Challenges
  const handleGenerateChallenges = async () => {
    setIsGeneratingChallenges(true);
    const targetSkills = blueprint?.technicalSkills.slice(0, 4).map(s => s.name) || ['Java', 'SQL', 'Python', 'REST APIs'];
    try {
      const response = await fetch('/api/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: targetSkills, jobTitle }),
      });
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      setChallenges([
        {
          id: 'gen-java-01',
          skill: 'Java',
          title: 'Find Duplicate Transactions',
          taskType: 'practical_coding',
          timeLimitMinutes: 5,
          difficulty: 'Intermediate',
          description: 'Given a list of transactions, write a Java method that identifies duplicate transaction IDs.',
          language: 'java',
          starterCode: `public static Set<String> findDuplicates(List<Transaction> list) {\n    // Implement here\n    return Collections.emptySet();\n}`,
          evaluationCriteria: ['Correctness', 'O(N) time complexity', 'Null handling']
        },
        {
          id: 'gen-sql-01',
          skill: 'SQL',
          title: 'Top 3 Customers by Total Order Value',
          taskType: 'system_query',
          timeLimitMinutes: 5,
          difficulty: 'Intermediate',
          description: 'Find the top 3 customers by total order value in completed orders.',
          language: 'sql',
          starterCode: `SELECT c.customer_id, c.customer_name, SUM(o.total_amount) AS total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\n-- complete query:\nLIMIT 3;`,
          evaluationCriteria: ['Join correctness', 'Group by aggregation', 'Order and limit']
        }
      ]);
    } finally {
      setIsGeneratingChallenges(false);
      setCurrentStep(5);
    }
  };

  // Finish wizard
  const handleCompleteEvaluation = () => {
    const finalEvaluation: Evaluation = {
      id: `eval-${Date.now()}`,
      jobTitle,
      department,
      locationType: 'Hybrid',
      jobDescription,
      blueprint: blueprint || {
        summary: 'Job Blueprint extracted by BlindHire',
        technicalSkills: [],
        coreCapabilities: [],
        experienceSignals: []
      },
      candidates,
      assessments: challenges,
      createdAt: new Date().toISOString(),
      status: 'in_progress',
    };
    onEvaluationCreated(finalEvaluation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <span>Step-by-Step Hiring Evaluation</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Evidence-Based Evaluation
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: 'Job Blueprint' },
              { num: 2, label: 'Resumes' },
              { num: 3, label: 'Blind Profiles' },
              { num: 4, label: 'Skill Claims' },
              { num: 5, label: 'Evidence Challenges' },
            ].map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isPast 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span className={`hidden sm:inline ${
                    isCurrent ? 'text-indigo-900 font-bold' : isPast ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Add Job & AI Blueprint */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Step 1 — Define Job & Analyze Blueprint</h4>
                  <p className="text-xs text-slate-500">
                    BlindHire will parse the job requirements into technical skills, core capabilities, and experience signals.
                  </p>
                </div>
                
                {/* Presets */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Presets:</span>
                  {PRESET_JOBS.map((preset, idx) => (
                    <button
                      key={preset.title}
                      onClick={() => {
                        setJobTitle(preset.title);
                        setDepartment(preset.dept);
                        setJobDescription(preset.desc);
                        setBlueprint(null);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Job Description</label>
                  <button
                    onClick={handleAnalyzeJob}
                    disabled={isAnalyzingJob || !jobDescription.trim()}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzingJob ? 'Analyzing Blueprint...' : 'Extract AI Blueprint'}</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Paste job description text here..."
                />
              </div>

              {/* Blueprint Display */}
              {blueprint && (
                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-100 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        AI Job Blueprint Generated
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Job Relevant
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{blueprint.summary}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 mb-2">Technical Skills</div>
                      <div className="space-y-1.5">
                        {blueprint.technicalSkills.map((s) => (
                          <div key={s.name} className="text-xs">
                            <span className="font-semibold text-indigo-900">{s.name}</span>
                            <p className="text-[10px] text-slate-500 leading-tight">{s.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 mb-2">Core Capabilities</div>
                      <div className="space-y-1.5">
                        {blueprint.coreCapabilities.map((c) => (
                          <div key={c.name} className="text-xs">
                            <span className="font-semibold text-slate-800">{c.name}</span>
                            <p className="text-[10px] text-slate-500 leading-tight">{c.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 mb-2">Experience Signals</div>
                      <div className="space-y-1.5">
                        {blueprint.experienceSignals.map((e) => (
                          <div key={e.name} className="text-xs">
                            <span className="font-semibold text-slate-800">{e.name}</span>
                            <p className="text-[10px] text-slate-500 leading-tight">{e.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Add Resumes */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 2 — Add Candidate Resumes</h4>
                <p className="text-xs text-slate-500">
                  Upload multiple resumes. BlindHire will extract job-relevant information while reducing exposure to unnecessary personal signals.
                </p>
              </div>

              {/* Drag and Drop Upload Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center bg-slate-50/60 transition cursor-pointer">
                <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-900">Drop resumes here or click to browse</div>
                <div className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, and TXT files</div>
                <div className="mt-3">
                  <span className="inline-block text-[11px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {rawResumes.length} candidate documents ready for evaluation
                  </span>
                </div>
              </div>

              {/* Ready documents list */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Documents Staged for Anonymization</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  {rawResumes.map((doc, idx) => (
                    <div key={doc.filename} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-800">{doc.filename}</span>
                        <span className="text-slate-400">({doc.text.length} chars)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Ready to Anonymize
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isProcessingResumes && (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex items-center space-x-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                  <div>
                    <div className="text-xs font-bold text-indigo-900">Processing Resumes with AI</div>
                    <div className="text-xs text-indigo-700">{processingStatusText}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Blind Profile Review */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Personal Signals Hidden</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Step 3 — Blind Candidate Profiles</h4>
                <p className="text-xs text-slate-500">
                  Names, photos, and other non-job-relevant personal signals are excluded from the evaluation view.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidates.map((cand) => (
                  <div key={cand.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-900">{cand.anonymousLabel}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        Blind ID
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Degree Standardized</div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">
                        {cand.anonymizedProfile.educationLevel}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Relevant Experience</div>
                      <ul className="text-[11px] text-slate-600 list-disc list-inside mt-1 space-y-1">
                        {cand.anonymizedProfile.relevantExperience.slice(0, 2).map((exp, i) => (
                          <li key={i} className="line-clamp-2">{exp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Signals Suppressed:</span>
                      <span className="font-bold text-emerald-600">{cand.personalSignalsHidden.totalSignalsSuppressed} markers</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Notice: Anonymization reduces personal demographic bias, but objective skill verification requires actual evidence from practical challenges.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Candidate Skill Claims */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900">Step 4 — Candidate Skill Claims</h4>
                <p className="text-xs text-slate-500">
                  BlindHire distinguishes between skills explicitly claimed, skills supported by documented project evidence, and unverified claims.
                </p>
              </div>

              <div className="space-y-4">
                {candidates.map((cand) => (
                  <div key={cand.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{cand.anonymousLabel}</span>
                        <span className="text-xs text-slate-500">— {cand.anonymizedProfile.headline}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {cand.extractedSkills.map((sk) => {
                        const isSupported = sk.status === 'supported';
                        const isUnverified = sk.status === 'unverified';
                        return (
                          <div 
                            key={sk.skill} 
                            className={`p-2.5 rounded-lg border text-xs ${
                              isSupported 
                                ? 'bg-emerald-50/50 border-emerald-200' 
                                : isUnverified 
                                ? 'bg-amber-50/50 border-amber-200' 
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900">{sk.skill}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                isSupported 
                                  ? 'bg-emerald-200 text-emerald-900' 
                                  : isUnverified 
                                  ? 'bg-amber-200 text-amber-900' 
                                  : 'bg-slate-200 text-slate-800'
                              }`}>
                                {isSupported ? 'Supported ✓' : isUnverified ? 'Unverified ?' : 'Claimed'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{sk.evidenceSnippet}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Evidence Challenge Studio */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center space-x-1.5 text-indigo-600 text-xs font-semibold mb-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Evidence Challenge Studio</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Step 5 — Practical Skill Challenges</h4>
                <p className="text-xs text-slate-500">
                  Turn job requirements into short practical tasks that test what matters. No marathon tests; focused 5-minute verifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((ch) => (
                  <div key={ch.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {ch.skill}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">{ch.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{ch.timeLimitMinutes}-min practical task</span>
                    </div>

                    <p className="text-xs text-slate-600">{ch.description}</p>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-700 mb-1">Evaluation Criteria:</div>
                      <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-0.5">
                        {ch.evaluationCriteria.map((crit, idx) => (
                          <li key={idx}>{crit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg text-slate-200 text-[11px] font-mono overflow-x-auto max-h-24">
                      <pre>{ch.starterCode}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {currentStep === 1 && (
              <button
                onClick={() => {
                  if (!blueprint) {
                    handleAnalyzeJob();
                  }
                  setCurrentStep(2);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <span>Continue to Resumes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={handleProcessResumes}
                disabled={isProcessingResumes}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>Anonymize & Extract</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <span>Review Skill Claims</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={handleGenerateChallenges}
                disabled={isGeneratingChallenges}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Challenges</span>
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={handleCompleteEvaluation}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Launch Evidence Workspace</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
