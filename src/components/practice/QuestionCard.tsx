'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  type AnswerMode,
  type Difficulty,
  type GeneratedQuestion,
  type QuestionType,
} from '@/lib/types';

interface Props {
  type: QuestionType;
  difficulty: Difficulty;
  answerMode: AnswerMode;
  question: GeneratedQuestion;
  onSubmit: (answer: {
    text?: string;
    selectedOptionId?: 'A' | 'B' | 'C' | 'D';
  }) => void;
  onBack: () => void;
  submitting: boolean;
}

export function QuestionCard({
  type,
  difficulty,
  answerMode,
  question,
  onSubmit,
  onBack,
  submitting,
}: Props) {
  const [answer, setAnswer] = React.useState('');
  const [selected, setSelected] = React.useState<'A' | 'B' | 'C' | 'D' | null>(
    null,
  );

  const canSubmit =
    answerMode === 'free' ? answer.trim().length >= 10 : selected !== null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    if (answerMode === 'free') onSubmit({ text: answer });
    else if (selected) onSubmit({ selectedOptionId: selected });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--color-border-strong)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="blue">{QUESTION_TYPE_LABELS[type]}</Badge>
          <Badge>{DIFFICULTY_LABELS[difficulty]}</Badge>
          <Badge>{answerMode === 'free' ? 'Free-form' : 'Multiple Choice'}</Badge>
        </div>
        <p className="label-eyebrow text-[var(--color-accent)]">Prompt</p>
        <h2 className="mt-2 text-xl sm:text-3xl font-bold leading-tight tracking-tight text-[var(--color-text)]">
          {question.question}
        </h2>
        {question.rubric?.length > 0 && (
          <details className="mt-5 cursor-pointer">
            <summary className="label-eyebrow select-none text-[var(--color-muted)] hover:text-[var(--color-text)]">
              Show rubric hints ({question.rubric.length})
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-muted)]">
              {question.rubric.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[var(--color-accent)]">—</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {answerMode === 'free' ? (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="label-eyebrow">Your Response</span>
              <span className="text-xs text-[var(--color-muted)]">
                {answer.trim().split(/\s+/).filter(Boolean).length} words ·{' '}
                {answer.length} characters
              </span>
            </div>
            <Textarea
              rows={10}
              placeholder={
                type === 'behavioral'
                  ? 'Structure your answer with Situation, Task, Action, Result…'
                  : 'Write your answer here…'
              }
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
            />
          </>
        ) : (
          <>
            <span className="label-eyebrow">Select One</span>
            <div role="radiogroup" className="mt-3 flex flex-col gap-2">
              {question.options?.map((opt) => {
                const active = selected === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex cursor-pointer gap-4 border p-4 transition-colors',
                      active
                        ? 'border-[var(--color-accent)] bg-[rgba(37,99,235,0.04)]'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)]',
                    )}
                  >
                    <input
                      type="radio"
                      name="mcq"
                      className="sr-only"
                      checked={active}
                      onChange={() => setSelected(opt.id)}
                    />
                    <span
                      className={cn(
                        'flex h-7 w-7 flex-shrink-0 items-center justify-center text-[0.7rem] font-bold',
                        active
                          ? 'bg-[var(--color-sidebar)] text-white'
                          : 'border border-[var(--color-border-strong)] text-[var(--color-muted)]',
                      )}
                    >
                      {opt.id}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--color-text)]">
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] p-4 sm:px-8">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit" size="lg" disabled={!canSubmit || submitting}>
          {submitting ? 'Submitting…' : 'Get Feedback →'}
        </Button>
      </div>
    </form>
  );
}
