import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Check, 
  FileText, 
  Sparkles, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';
import { Candidate, JobBlueprint } from '../types';
import { SAMPLE_EVALUATION } from '../data/sampleEvaluation';

interface Step2AddResumesProps {
  candidates: Candidate[];
  blueprint: JobBlueprint;
  onUpdateCandidates: (candidates: Candidate[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step2AddResumes: React.FC<Step2AddResumesProps> = ({
  candidates,
  blueprint,
  onUpdateCandidates,
  onContinue,
  onBack,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(
    candidates.length > 0 
      ? candidates.map((c) => `${c.anonymousLabel} (Resume ready)`)
      : ['Candidate_01_Resume.pdf', 'Candidate_02_Resume.pdf', 'Candidate_03_Resume.pdf']
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Quick helper to load pre-anonymized sample candidates if none exist
  const handleLoadSampleCandidates = () => {
    onUpdateCandidates(SAMPLE_EVALUATION.candidates);
    setUploadedFiles(SAMPLE_EVALUATION.candidates.map((c) => `${c.anonymousLabel} (Resume ready)`));
  };

  const handleSimulateUpload = (filename: string) => {
    const nextIdx = uploadedFiles.length + 1;
    const newFile = filename || `Candidate_${String(nextIdx).padStart(2, '0')}_Resume.pdf`;
    setUploadedFiles([...uploadedFiles, newFile]);
  };

  const handleProceedToBlindProfiles = async () => {
    // If candidates not loaded or need processing, show stepped loader
    setIsProcessing(true);
    setProcessingStep(0);

    const t1 = setTimeout(() => setProcessingStep(1), 500);
    const t2 = setTimeout(() => setProcessingStep(2), 1100);
    const t3 = setTimeout(() => setProcessingStep(3), 1700);

    // If candidates list is empty, default to sample candidates
    if (candidates.length === 0) {
      onUpdateCandidates(SAMPLE_EVALUATION.candidates);
    }

    setTimeout(() => {
      setIsProcessing(false);
      onContinue();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {isProcessing ? (
        /* Stepped Loading State */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Anonymizing & processing resumes…
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Redacting legal names, photos, gender markers, and contact details to ensure unbiased screening.
            </p>
          </div>

          {/* Stepped progress indicators */}
          <div className="max-w-xs mx-auto text-left space-y-2.5 text-xs sm:text-sm pt-2">
            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                processingStep >= 1 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {processingStep >= 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </span>
              <span className={processingStep >= 1 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Reading documents
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                processingStep >= 2 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {processingStep >= 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
              </span>
              <span className={processingStep >= 2 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Extracting skill evidence & projects
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                processingStep >= 3 ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {processingStep >= 3 ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
              </span>
              <span className={processingStep >= 3 ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                Creating blind candidate profiles
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Add candidate resumes
            </h1>
            <p className="text-sm text-slate-600">
              Upload the resumes you want to evaluate. Personal signals will be hidden before review.
            </p>
          </div>

          {/* Central Upload Area */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div 
              onClick={() => handleSimulateUpload(`Candidate_${String(uploadedFiles.length + 1).padStart(2, '0')}_Resume.pdf`)}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-xl p-8 text-center space-y-3 transition cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold text-slate-900 block">
                  Drag & drop resumes here
                </span>
                <span className="text-xs text-slate-600 block">
                  or <span className="text-indigo-600 font-semibold hover:underline">browse files</span> from your computer
                </span>
              </div>
              <div className="text-[11px] text-slate-600 pt-1">
                PDF and DOCX supported • Up to 25 resumes at once
              </div>
            </div>

            {/* Quick Demo Pre-load Helper */}
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <span>Looking for a quick demo?</span>
              <button
                type="button"
                onClick={handleLoadSampleCandidates}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Use 3 sample candidate resumes
              </button>
            </div>

            {/* Uploaded Candidates List */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Ready Resumes ({uploadedFiles.length})
                </h2>
                <span className="text-[11px] text-slate-600 font-medium">Names will be masked in next step</span>
              </div>

              <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Candidate {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Resume ready</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Ready ✓
                      </span>
                      {uploadedFiles.length > 1 && (
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              onClick={handleProceedToBlindProfiles}
              disabled={uploadedFiles.length === 0}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Continue to Blind Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
