'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
      <div className="flex items-center gap-2">
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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge tone="accent">{QUESTION_TYPE_LABELS[type]}</Badge>
          </div>
          <CardTitle className="text-lg leading-snug">
            {question.question}
          </CardTitle>
          <CardDescription>
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
                <div className="mt-2 whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm">
                  {submittedAnswer.text}
                </div>
              </details>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            {streaming
              ? 'Generating your feedback — you can start reading now…'
              : error
                ? 'There was a problem generating feedback.'
                : 'Review the strengths, gaps, and model answer below.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.08)] p-4 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-4 h-4 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="prose-feedback">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
              {streaming && (
                <span className="inline-block h-4 w-1.5 translate-y-0.5 animate-pulse-soft bg-[var(--color-accent)] ml-0.5 rounded-sm align-middle" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onNewSameSettings} disabled={streaming}>
          New question (same settings)
        </Button>
        <Button variant="outline" onClick={onStartOver} disabled={streaming}>
          Start over
        </Button>
      </div>
    </div>
  );
}
