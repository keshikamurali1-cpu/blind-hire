import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Play, 
  X,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { AssessmentChallenge, Evaluation } from '../types';

interface AssessmentsStudioViewProps {
  evaluation: Evaluation;
  onUpdateChallenges: (challenges: AssessmentChallenge[]) => void;
  onSwitchToCandidatePortal: () => void;
}

export const AssessmentsStudioView: React.FC<AssessmentsStudioViewProps> = ({
  evaluation,
  onUpdateChallenges,
  onSwitchToCandidatePortal,
}) => {
  const [challenges, setChallenges] = useState<AssessmentChallenge[]>(evaluation.assessments);
  const [selectedChallenge, setSelectedChallenge] = useState<AssessmentChallenge>(
    evaluation.assessments[0] || null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // Regenerate a single challenge using AI
  const handleRegenerateChallenge = async (challengeId: string) => {
    const target = challenges.find(c => c.id === challengeId);
    if (!target) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: [target.skill], jobTitle: evaluation.jobTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedOne = data.challenges[0];
        if (updatedOne) {
          const next = challenges.map(c => c.id === challengeId ? { ...updatedOne, id: challengeId } : c);
          setChallenges(next);
          setSelectedChallenge(updatedOne);
          onUpdateChallenges(next);
        }
      }
    } catch (e) {
      console.warn('Fallback regeneration');
    } finally {
      setIsGenerating(false);
    }
  };

  // Create new challenge for a skill
  const handleCreateNewSkillChallenge = async () => {
    if (!newSkillName.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: [newSkillName.trim()], jobTitle: evaluation.jobTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        const created = data.challenges[0];
        if (created) {
          const next = [...challenges, created];
          setChallenges(next);
          setSelectedChallenge(created);
          onUpdateChallenges(next);
        }
      }
    } catch (e) {
      console.warn('Fallback create');
      const fallback: AssessmentChallenge = {
        id: `c-${Date.now()}`,
        skill: newSkillName.trim(),
        title: `Verify ${newSkillName.trim()} Implementation`,
        taskType: 'practical_coding',
        timeLimitMinutes: 5,
        difficulty: 'Intermediate',
        description: `Write a robust implementation satisfying real-world requirements for ${newSkillName.trim()}.`,
        starterCode: `// Implement ${newSkillName.trim()} solution here\n`,
        evaluationCriteria: ['Correctness', 'Edge cases', 'Clean code']
      };
      const next = [...challenges, fallback];
      setChallenges(next);
      setSelectedChallenge(fallback);
      onUpdateChallenges(next);
    } finally {
      setIsGenerating(false);
      setShowNewModal(false);
      setNewSkillName('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Practical Assessment Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Evidence Challenge Studio ({challenges.length} Active Challenges)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn job requirements into short practical tasks that test what matters. No marathon homework assignments; focused 5-minute verifications.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill Challenge</span>
          </button>

          <button
            onClick={onSwitchToCandidatePortal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Test in Candidate Portal</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Challenge Cards List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Generated Micro-Challenges
          </div>
          <div className="space-y-2">
            {challenges.map((ch) => {
              const isSelected = ch.id === selectedChallenge?.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChallenge(ch)}
                  className={`p-4 rounded-xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded">
                      {ch.skill}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {ch.timeLimitMinutes} min task
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1">{ch.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{ch.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Challenge Inspector / Editor */}
        {selectedChallenge && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {selectedChallenge.skill}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">
                    ~{selectedChallenge.timeLimitMinutes} minutes
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedChallenge.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRegenerateChallenge(selectedChallenge.id)}
                  disabled={isGenerating}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate with AI</span>
                </button>
              </div>
            </div>

            {/* Prompt description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Practical Task Description
              </label>
              <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-200 leading-relaxed">
                {selectedChallenge.description}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Evaluation Criteria
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedChallenge.evaluationCriteria.map((crit, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Code */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Starter Workspace ({selectedChallenge.language || 'code'})</span>
                <span className="text-[11px] text-slate-400">Provided to candidate</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
                <pre>{selectedChallenge.starterCode}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Challenge Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Generate Challenge for Skill</h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter any technical capability (e.g. GraphQL, Docker, TypeScript, Redis) and BlindHire will generate a 5-minute task.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Skill or Tool Name</label>
              <input
                type="text"
                placeholder="e.g. TypeScript, Redis, GraphQL"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewSkillChallenge}
                disabled={isGenerating || !newSkillName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
