'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeneratedQuestion, McqOption, QuestionType } from '@/lib/types';
import { QUESTION_TYPE_LABELS } from '@/lib/types';

interface Props {
  question: GeneratedQuestion;
  type: QuestionType;
  submittedAnswer: { text?: string; selectedOptionId?: 'A' | 'B' | 'C' | 'D' };
  feedback: string;
  streaming: boolean;
  error: string | null;
  onNewSameSettings: () => void;
  onStartOver: () => void;
}

function OptionSummary({
  options,
  selectedId,
}: {
  options: McqOption[];
  selectedId: 'A' | 'B' | 'C' | 'D';
}) {
  const chosen = options.find((o) => o.id === selectedId);
  const best = options.find((o) => o.isBest);
  const isBest = chosen?.id === best?.id;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={isBest ? 'success' : 'warning'}>
          You chose {selectedId}
          {isBest ? ' — best option' : ''}
        </Badge>
        {!isBest && best && <Badge tone="success">Best: {best.id}</Badge>}
      </div>
      <p className="text-sm text-[var(--color-muted)]">{chosen?.text}</p>
    </div>
  );
}

export function FeedbackPanel({
  question,
  type,
  submittedAnswer,
  feedback,
  streaming,
  error,
  onNewSameSettings,
  onStartOver,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <section className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="blue">{QUESTION_TYPE_LABELS[type]}</Badge>
          {streaming && <Badge tone="accent">Streaming</Badge>}
        </div>
        <p className="label-eyebrow text-[var(--color-accent)]">Prompt</p>
        <h2 className="mt-2 text-lg sm:text-xl font-bold leading-snug tracking-tight">
          {question.question}
        </h2>

        <div className="mt-5 border-t border-[var(--color-border)] pt-4">
          <p className="label-eyebrow mb-2">Your Submission</p>
          {submittedAnswer.selectedOptionId && question.options ? (
            <OptionSummary
              options={question.options}
              selectedId={submittedAnswer.selectedOptionId}
            />
          ) : (
            <details className="cursor-pointer">
              <summary className="select-none text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]">
                Show your answer
              </summary>
              <div className="mt-2 whitespace-pre-wrap border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-text)]">
                {submittedAnswer.text}
              </div>
            </details>
          )}
        </div>
      </section>

      <section className="border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
        <header className="flex items-baseline justify-between border-b border-[var(--color-border)] p-6 sm:px-8">
          <div>
            <p className="label-eyebrow text-[var(--color-accent)]">Analysis</p>
            <h3 className="mt-1 text-lg font-bold uppercase tracking-tight">
              Feedback Report
            </h3>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            {streaming
              ? 'Generating…'
              : error
                ? 'Error'
                : feedback
                  ? 'Complete'
                  : 'Pending'}
          </p>
        </header>
        <div className="p-6 sm:p-8">
          {error ? (
            <div className="border border-[var(--color-danger)]/40 bg-[rgba(185,28,28,0.06)] p-4 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-4 h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="prose-feedback">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {feedback}
              </ReactMarkdown>
              {streaming && (
                <span className="inline-block h-4 w-1.5 translate-y-0.5 animate-pulse-soft bg-[var(--color-accent)] ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border-strong)] pt-4">
        <Button onClick={onNewSameSettings} disabled={streaming}>
          New Question (same settings)
        </Button>
        <Button variant="outline" onClick={onStartOver} disabled={streaming}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
