import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  RefreshCw, 
  Edit3, 
  Eye, 
  Code2, 
  CheckCircle2 
} from 'lucide-react';
import { AssessmentChallenge, JobBlueprint } from '../types';

interface Step5ChallengeGeneratorProps {
  challenges: AssessmentChallenge[];
  blueprint: JobBlueprint;
  onUpdateChallenges: (challenges: AssessmentChallenge[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step5ChallengeGenerator: React.FC<Step5ChallengeGeneratorProps> = ({
  challenges,
  blueprint,
  onUpdateChallenges,
  onContinue,
  onBack,
}) => {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fallback default challenges if none provided
  const activeChallenges = challenges.length > 0 ? challenges : [
    {
      id: 'ch-java-01',
      skill: 'Java',
      title: 'Identify Duplicate Transaction IDs',
      taskType: 'practical_coding' as const,
      timeLimitMinutes: 5,
      difficulty: 'Intermediate' as const,
      description: 'Write a method findDuplicateTransactions(List<Transaction> transactions) that returns IDs appearing more than once within a given timeframe.',
      starterCode: `public List<String> findDuplicateTransactions(List<Transaction> transactions) {\n    // Write your solution here\n    return new ArrayList<>();\n}`,
      evaluationCriteria: ['Correctness', 'Time Complexity O(N)', 'Edge cases: null or empty list']
    },
    {
      id: 'ch-sql-01',
      skill: 'SQL',
      title: 'Top 3 Customers by Total Order Value',
      taskType: 'system_query' as const,
      timeLimitMinutes: 5,
      difficulty: 'Intermediate' as const,
      description: 'Find the top 3 customers by total order value in 2026. Return customer_name, total_spent, and order_count.',
      starterCode: `SELECT c.name, SUM(o.amount) AS total_spent\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\n-- complete query:\n`,
      evaluationCriteria: ['Correctness', 'Grouping & Aggregations', 'Correct Ordering & Limit']
    },
    {
      id: 'ch-python-01',
      skill: 'Python',
      title: 'Sliding Window Rate Limiter',
      taskType: 'practical_coding' as const,
      timeLimitMinutes: 5,
      difficulty: 'Intermediate' as const,
      description: 'Implement an in-memory RateLimiter class that allows at most N requests per 60-second sliding window per client IP.',
      starterCode: `class RateLimiter:\n    def __init__(self, max_requests: int, window_seconds: int = 60):\n        self.max_requests = max_requests\n        self.window_seconds = window_seconds\n\n    def is_allowed(self, client_id: str, timestamp: float) -> bool:\n        pass`,
      evaluationCriteria: ['Sliding window logic', 'Memory cleanup of old requests', 'Thread safety']
    },
    {
      id: 'ch-rest-01',
      skill: 'REST APIs',
      title: 'Design Idempotent Payment Endpoint',
      taskType: 'api_logic' as const,
      timeLimitMinutes: 5,
      difficulty: 'Intermediate' as const,
      description: 'Design the request/response schema and handling logic for a POST /payments endpoint using an Idempotency-Key header.',
      starterCode: `// Define idempotency status codes, headers, and payload schema:\n`,
      evaluationCriteria: ['Idempotency-Key header handling', 'HTTP 200 vs 201 vs 409 status codes', 'Cache storage lifecycle']
    }
  ];

  const currentChallenge = activeChallenges[selectedSkillIndex] || activeChallenges[0];

  // Temporary edit state
  const [editedTitle, setEditedTitle] = useState(currentChallenge?.title || '');
  const [editedDesc, setEditedDesc] = useState(currentChallenge?.description || '');

  const handleSelectSkill = (idx: number) => {
    setSelectedSkillIndex(idx);
    setIsEditing(false);
    setIsPreviewOpen(false);
    const ch = activeChallenges[idx];
    if (ch) {
      setEditedTitle(ch.title);
      setEditedDesc(ch.description);
    }
  };

  const handleSaveEdit = () => {
    const updated = activeChallenges.map((ch, idx) => {
      if (idx !== selectedSkillIndex) return ch;
      return {
        ...ch,
        title: editedTitle,
        description: editedDesc,
      };
    });
    onUpdateChallenges(updated);
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create skill challenges
        </h1>
        <p className="text-sm text-slate-600">
          Turn important job requirements into short practical tasks (5 minutes each).
        </p>
      </div>

      {/* Detected Skills Ribbon */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Detected Job Skills
          </span>
          <span>Review one challenge at a time</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeChallenges.map((ch, idx) => {
            const isSelected = idx === selectedSkillIndex;
            return (
              <button
                key={ch.id || ch.skill}
                onClick={() => handleSelectSkill(idx)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{ch.skill}</span>
                <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Challenge Card Review */}
      {currentChallenge && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
          {/* Card Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                {currentChallenge.skill} Challenge • 5-minute practical task
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentChallenge.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentChallenge.timeLimitMinutes} mins</span>
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                {currentChallenge.difficulty}
              </span>
            </div>
          </div>

          {/* Description or Edit Mode */}
          {isEditing ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Challenge Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Task Prompt</label>
                <textarea
                  rows={3}
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Challenge Prompt
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                "{currentChallenge.description}"
              </p>
            </div>
          )}

          {/* Evaluation Criteria */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Evaluation Criteria
            </span>
            <div className="flex flex-wrap gap-2">
              {currentChallenge.evaluationCriteria.map((crit, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{crit}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Starter Code Preview */}
          {isPreviewOpen && currentChallenge.starterCode && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Candidate Starter Code
              </span>
              <pre className="p-3 bg-slate-900 text-slate-100 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed">
                {currentChallenge.starterCode}
              </pre>
            </div>
          )}

          {/* Card Action Buttons: Edit, Regenerate, Preview */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditedTitle(currentChallenge.title);
                  setEditedDesc(currentChallenge.description);
                  setIsEditing(!isEditing);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating…' : 'Regenerate'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>{isPreviewOpen ? 'Hide Preview' : 'Preview'}</span>
              </button>
            </div>

            {/* Stepper between challenges */}
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>Challenge {selectedSkillIndex + 1} of {activeChallenges.length}</span>
              {selectedSkillIndex < activeChallenges.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleSelectSkill(selectedSkillIndex + 1)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer ml-1"
                >
                  Next Challenge →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
        >
          <span>Continue to Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
