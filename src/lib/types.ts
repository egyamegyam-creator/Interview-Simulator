export type QuestionType = 'behavioral' | 'case' | 'situational';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AnswerMode = 'free' | 'mcq';

export interface McqOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isBest: boolean;
  rationale: string;
}

export interface GeneratedQuestion {
  question: string;
  rubric: string[];
  options?: McqOption[];
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  behavioral: 'Behavioral (STAR)',
  case: 'Case / Open-ended',
  situational: 'Situational Judgment',
};

export const QUESTION_TYPE_DESCRIPTIONS: Record<QuestionType, string> = {
  behavioral:
    'Past-experience questions answered with Situation, Task, Action, Result.',
  case: 'Analytical prompts asking you to structure an approach to a business or technical problem.',
  situational:
    'Hypothetical scenarios testing judgment — what would you do if…?',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
