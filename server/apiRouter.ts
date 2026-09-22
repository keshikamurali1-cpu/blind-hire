import { Router, Request, Response } from 'express';
import {
  analyzeJobDescriptionAI,
  anonymizeAndExtractResumeAI,
  generateChallengeAI,
  evaluateSubmissionAI,
} from './geminiService';

export const apiRouter = Router();

apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post('/analyze-job', async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ error: 'jobDescription string is required.' });
      return;
    }
    const blueprint = await analyzeJobDescriptionAI(jobDescription);
    res.json({ blueprint, usedAI: !!process.env.GEMINI_API_KEY });
  } catch (error: any) {
    console.error('Error analyzing job description:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze job description' });
  }
});

apiRouter.post('/anonymize-resumes', async (req: Request, res: Response) => {
  try {
    const { resumes, jobSkills = [] } = req.body;
    if (!Array.isArray(resumes) || resumes.length === 0) {
      res.status(400).json({ error: 'resumes array is required.' });
      return;
    }

    const candidates = await Promise.all(
      resumes.map(async (item: { text: string; filename?: string }, idx: number) => {
        return anonymizeAndExtractResumeAI(item.text, idx + 1, jobSkills);
      })
    );

    res.json({ candidates, usedAI: !!process.env.GEMINI_API_KEY });
  } catch (error: any) {
    console.error('Error processing resumes:', error);
    res.status(500).json({ error: error.message || 'Failed to process resumes' });
  }
});

apiRouter.post('/generate-challenges', async (req: Request, res: Response) => {
  try {
    const { skills, jobTitle = 'Software Engineer' } = req.body;
    if (!Array.isArray(skills) || skills.length === 0) {
      res.status(400).json({ error: 'skills array is required.' });
      return;
    }

    const challenges = await Promise.all(
      skills.map((skill: string) => generateChallengeAI(skill, jobTitle))
    );

    res.json({ challenges, usedAI: !!process.env.GEMINI_API_KEY });
  } catch (error: any) {
    console.error('Error generating challenges:', error);
    res.status(500).json({ error: error.message || 'Failed to generate challenges' });
  }
});

apiRouter.post('/evaluate-submission', async (req: Request, res: Response) => {
  try {
    const { challenge, candidateAnswer } = req.body;
    if (!challenge || typeof candidateAnswer !== 'string') {
      res.status(400).json({ error: 'challenge and candidateAnswer are required.' });
      return;
    }

    const submission = await evaluateSubmissionAI(challenge, candidateAnswer);
    res.json({ submission, usedAI: !!process.env.GEMINI_API_KEY });
  } catch (error: any) {
    console.error('Error evaluating submission:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate submission' });
  }
});
