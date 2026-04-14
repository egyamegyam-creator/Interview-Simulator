import { z } from 'zod';

export const questionTypeSchema = z.enum(['behavioral', 'case', 'situational']);
export const difficultySchema = z.enum(['easy', 'medium', 'hard']);
export const answerModeSchema = z.enum(['free', 'mcq']);

export const mcqOptionSchema = z.object({
  id: z.enum(['A', 'B', 'C', 'D']),
  text: z.string().min(1),
  isBest: z.boolean(),
  rationale: z.string().min(1),
});

export const generatedQuestionSchema = z.object({
  question: z.string().min(1),
  rubric: z.array(z.string().min(1)).min(2).max(8),
  options: z.array(mcqOptionSchema).length(4).optional(),
});

export const generateQuestionsRequestSchema = z.object({
  type: questionTypeSchema,
  difficulty: difficultySchema,
  answerMode: answerModeSchema,
  jobDescription: z.string().max(10_000).optional(),
});

export const feedbackRequestSchema = z.object({
  type: questionTypeSchema,
  question: z.string().min(1),
  rubric: z.array(z.string()).default([]),
  answerMode: answerModeSchema,
  answer: z.string().default(''),
  options: z.array(mcqOptionSchema).length(4).optional(),
  selectedOptionId: z.enum(['A', 'B', 'C', 'D']).optional(),
  jobDescription: z.string().max(10_000).optional(),
});

export const scrapeJdRequestSchema = z.object({
  url: z.string().url(),
});
