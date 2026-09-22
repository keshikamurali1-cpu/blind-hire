import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  FileText, 
  Edit2, 
  Layers
} from 'lucide-react';
import { JobBlueprint, JobRequirement } from '../types';

interface Step1AddJobProps {
  initialJobTitle?: string;
  initialJobDescription?: string;
  initialBlueprint?: JobBlueprint | null;
  onSaveJobAndBlueprint: (jobTitle: string, jobDescription: string, blueprint: JobBlueprint) => void;
  onExit: () => void;
}

const SAMPLE_JOB_TEXT = `Role: Junior Software Engineer
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
- Comfort with version control (Git) and automated testing environments.`;

export const Step1AddJob: React.FC<Step1AddJobProps> = ({
  initialJobTitle = 'Junior Software Engineer',
  initialJobDescription = '',
  initialBlueprint = null,
  onSaveJobAndBlueprint,
  onExit,
}) => {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [jobDescription, setJobDescription] = useState(initialJobDescription || SAMPLE_JOB_TEXT);
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [blueprint, setBlueprint] = useState<JobBlueprint | null>(initialBlueprint);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);

  // New requirement draft state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'core_capability' | 'experience_signal'>('technical');

  // Handle continuing to analysis
  const handleStartAnalysis = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Simulated progress steps for great UX
    const timer1 = setTimeout(() => setAnalysisStep(1), 500);
    const timer2 = setTimeout(() => setAnalysisStep(2), 1100);
    const timer3 = setTimeout(() => setAnalysisStep(3), 1700);

    try {
      // Call backend API if available
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      let parsedBlueprint: JobBlueprint;
      if (response.ok) {
        const data = await response.json();
        parsedBlueprint = data.blueprint;
      } else {
        // Fallback default structured blueprint
        parsedBlueprint = {
          summary: 'Software engineering role focusing on backend programming, database queries, and RESTful architectures.',
          technicalSkills: [
            { id: 't1', name: 'Java', category: 'technical', required: true, level: 'Intermediate', explanation: 'Core language for platform services.' },
            { id: 't2', name: 'Python', category: 'technical', required: false, level: 'Foundational', explanation: 'Scripting and data pipeline support.' },
            { id: 't3', name: 'SQL', category: 'technical', required: true, level: 'Intermediate', explanation: 'Relational data querying and transactions.' },
            { id: 't4', name: 'REST APIs', category: 'technical', required: true, level: 'Intermediate', explanation: 'Building and consuming HTTP endpoints.' },
          ],
          coreCapabilities: [
            { id: 'c1', name: 'Problem solving', category: 'core_capability', required: true, explanation: 'Algorithmic thinking and debugging.' },
            { id: 'c2', name: 'Database handling', category: 'core_capability', required: true, explanation: 'Relational schema design and indexing.' },
            { id: 'c3', name: 'API development', category: 'core_capability', required: true, explanation: 'Designing idempotent and resilient endpoints.' },
          ],
          experienceSignals: [
            { id: 'e1', name: 'Software projects', category: 'experience_signal', required: true, explanation: 'Demonstrated hands-on coding work.' },
            { id: 'e2', name: 'Development experience', category: 'experience_signal', required: false, explanation: 'Collaborative development or internship.' },
          ],
        };
      }

      setTimeout(() => {
        setBlueprint(parsedBlueprint);
        setIsAnalyzing(false);
      }, 2200);
    } catch {
      // Offline fallback
      setTimeout(() => {
        setBlueprint({
          summary: 'Software engineering role focusing on backend programming, database queries, and RESTful architectures.',
          technicalSkills: [
            { id: 't1', name: 'Java', category: 'technical', required: true, level: 'Intermediate', explanation: 'Core language for platform services.' },
            { id: 't2', name: 'Python', category: 'technical', required: false, level: 'Foundational', explanation: 'Scripting and data pipeline support.' },
            { id: 't3', name: 'SQL', category: 'technical', required: true, level: 'Intermediate', explanation: 'Relational data querying and transactions.' },
            { id: 't4', name: 'REST APIs', category: 'technical', required: true, level: 'Intermediate', explanation: 'Building and consuming HTTP endpoints.' },
          ],
          coreCapabilities: [
            { id: 'c1', name: 'Problem solving', category: 'core_capability', required: true, explanation: 'Algorithmic thinking and debugging.' },
            { id: 'c2', name: 'Database handling', category: 'core_capability', required: true, explanation: 'Relational schema design and indexing.' },
            { id: 'c3', name: 'API development', category: 'core_capability', required: true, explanation: 'Designing idempotent and resilient endpoints.' },
          ],
          experienceSignals: [
            { id: 'e1', name: 'Software projects', category: 'experience_signal', required: true, explanation: 'Demonstrated hands-on coding work.' },
            { id: 'e2', name: 'Development experience', category: 'experience_signal', required: false, explanation: 'Collaborative development or internship.' },
          ],
        });
        setIsAnalyzing(false);
      }, 2200);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Add a new requirement
  const handleAddRequirement = () => {
    if (!newSkillName.trim() || !blueprint) return;
    const newReq: JobRequirement = {
      id: `custom-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      required: true,
      explanation: 'Specified by recruiter during role setup.',
      level: 'Intermediate',
    };

    if (newSkillCategory === 'technical') {
      setBlueprint({
        ...blueprint,
        technicalSkills: [...blueprint.technicalSkills, newReq],
      });
    } else if (newSkillCategory === 'core_capability') {
      setBlueprint({
        ...blueprint,
        coreCapabilities: [...blueprint.coreCapabilities, newReq],
      });
    } else {
      setBlueprint({
        ...blueprint,
        experienceSignals: [...blueprint.experienceSignals, newReq],
      });
    }

    setNewSkillName('');
  };

  // Remove a requirement
  const handleRemoveRequirement = (id: string, category: 'technical' | 'core_capability' | 'experience_signal') => {
    if (!blueprint) return;
    if (category === 'technical') {
      setBlueprint({
        ...blueprint,
        technicalSkills: blueprint.technicalSkills.filter((s) => s.id !== id),
      });
    } else if (category === 'core_capability') {
      setBlueprint({
        ...blueprint,
        coreCapabilities: blueprint.coreCapabilities.filter((c) => c.id !== id),
      });
    } else {
      setBlueprint({
        ...blueprint,
        experienceSignals: blueprint.experienceSignals.filter((e) => e.id !== id),
      });
    }
  };

  // Final continue to step 2 (Add Resumes)
  const handleProceedToResumes = () => {
    if (blueprint) {
      onSaveJobAndBlueprint(jobTitle, jobDescription, blueprint);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Step-based AI Loading State */}
      {isAnalyzing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Analyzing job description…
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Extracting objective technical skills, core capabilities, and required experience signals.
            </p>
          </div>

          {/* Stepped progress indicators */}
          <div className="max-w-xs mx-auto text-left space-y-2.5 text-xs sm:text-sm pt-2">
            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                analysisStep >= 1 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {analysisStep >= 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </span>
              <span className={analysisStep >= 1 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Reading job document
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                analysisStep >= 2 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {analysisStep >= 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
              </span>
              <span className={analysisStep >= 2 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Extracting core skills & tasks
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                analysisStep >= 3 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {analysisStep >= 3 ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
              </span>
              <span className={analysisStep >= 3 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Structuring Job Blueprint
              </span>
            </div>
          </div>
        </div>
      ) : !blueprint ? (
        /* 2. Initial Form: "What role are you hiring for?" */
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What role are you hiring for?
            </h1>
            <p className="text-sm text-slate-600">
              Start by adding the job description.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
            {/* Role Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Role / Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Junior Software Engineer"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 font-medium transition"
              />
            </div>

            {/* Input Method Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Job Description
                </label>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setInputMode('paste')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      inputMode === 'paste'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      inputMode === 'upload'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {inputMode === 'paste' ? (
                <div className="space-y-2">
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here..."
                    className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-slate-800 leading-relaxed transition"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{jobDescription.length} characters</span>
                    <button
                      type="button"
                      onClick={() => setJobDescription(SAMPLE_JOB_TEXT)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      Reset to sample job text
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Drag-and-Drop area */
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-8 text-center space-y-3 transition cursor-pointer">
                  <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Drag & drop job description here
                    </span>
                    <span className="text-xs text-slate-600 block mt-0.5">
                      or click to browse (.pdf, .docx, .txt)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setJobDescription(SAMPLE_JOB_TEXT);
                      setInputMode('paste');
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-block underline pt-1 cursor-pointer"
                  >
                    Or load standard sample text
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onExit}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              Save & Exit
            </button>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={!jobDescription.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 3. Job Analysis Screen: "Job Blueprint" */
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Job Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Blueprint
            </h1>
            <p className="text-sm text-slate-600">
              We found these requirements in the job description for <strong className="text-slate-800 font-semibold">{jobTitle}</strong>.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            {/* Technical Skills Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Technical Skills
                </h2>
                <span className="text-[11px] text-slate-600 font-medium">Objective capabilities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprint.technicalSkills.map((skill) => (
                  <div
                    key={skill.id || skill.name}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold rounded-lg"
                  >
                    <span>{skill.name}</span>
                    {skill.required && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" title="Required" />
                    )}
                    {isEditingRequirements && (
                      <button
                        onClick={() => handleRemoveRequirement(skill.id, 'technical')}
                        className="text-indigo-400 hover:text-indigo-700 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Core Capabilities Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Core Capabilities
                </h2>
                <span className="text-[11px] text-slate-600 font-medium">Problem solving & systems</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprint.coreCapabilities.map((cap) => (
                  <div
                    key={cap.id || cap.name}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    <span>{cap.name}</span>
                    {isEditingRequirements && (
                      <button
                        onClick={() => handleRemoveRequirement(cap.id, 'core_capability')}
                        className="text-slate-400 hover:text-slate-700 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Experience Signals
                </h2>
                <span className="text-[11px] text-slate-600 font-medium">Demonstrated work context</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprint.experienceSignals.map((exp) => (
                  <div
                    key={exp.id || exp.name}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    <span>{exp.name}</span>
                    {isEditingRequirements && (
                      <button
                        onClick={() => handleRemoveRequirement(exp.id, 'experience_signal')}
                        className="text-slate-400 hover:text-slate-700 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Requirements Form (if open) */}
            {isEditingRequirements && (
              <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50 p-3.5 rounded-xl">
                <span className="text-xs font-bold text-slate-800 block">Add New Requirement</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Requirement name (e.g. Docker, GraphQL)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="technical">Technical Skill</option>
                    <option value="core_capability">Core Capability</option>
                    <option value="experience_signal">Experience Signal</option>
                  </select>
                  <button
                    onClick={handleAddRequirement}
                    className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Toggle edit requirements */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsEditingRequirements(!isEditingRequirements)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingRequirements ? 'Done editing' : 'Edit requirements'}</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setBlueprint(null)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Job Text</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToResumes}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Continue to Resumes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
