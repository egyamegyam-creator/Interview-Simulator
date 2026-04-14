'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  onSubmit: (answer: { text?: string; selectedOptionId?: 'A' | 'B' | 'C' | 'D' }) => void;
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge tone="accent">{QUESTION_TYPE_LABELS[type]}</Badge>
            <Badge tone="default">{DIFFICULTY_LABELS[difficulty]}</Badge>
            <Badge tone="default">
              {answerMode === 'free' ? 'Free-form' : 'Multiple choice'}
            </Badge>
          </div>
          <CardTitle className="text-xl sm:text-2xl leading-snug">
            {question.question}
          </CardTitle>
          {question.rubric?.length > 0 && (
            <CardDescription className="mt-3">
              <details className="cursor-pointer">
                <summary className="select-none text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  Show rubric hints ({question.rubric.length})
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
                  {question.rubric.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--color-accent)]">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {answerMode === 'free' ? (
            <>
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
              <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                <span>{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>{answer.length} characters</span>
              </div>
            </>
          ) : (
            <div role="radiogroup" className="flex flex-col gap-2">
              {question.options?.map((opt) => {
                const active = selected === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors',
                      active
                        ? 'border-[var(--color-accent)] bg-[rgba(167,139,250,0.08)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:bg-[#1f2431]',
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
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                        active
                          ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[#0b0d12]'
                          : 'border-[var(--color-border)] text-[var(--color-muted)]',
                      )}
                    >
                      {opt.id}
                    </span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit || submitting}>
              {submitting ? 'Submitting…' : 'Get feedback →'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
