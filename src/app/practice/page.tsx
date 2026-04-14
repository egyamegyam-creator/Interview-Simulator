'use client';

import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { DocHeader } from '@/components/layout/DocHeader';
import { FeedbackPanel } from '@/components/practice/FeedbackPanel';
import { ProgressSteps, type Stage } from '@/components/practice/ProgressSteps';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { SetupForm, type SetupValues } from '@/components/practice/SetupForm';
import type { GeneratedQuestion, QuestionType } from '@/lib/types';

type SubmittedAnswer = {
  text?: string;
  selectedOptionId?: 'A' | 'B' | 'C' | 'D';
};

function isQuestionType(v: string | null): v is QuestionType {
  return v === 'behavioral' || v === 'case' || v === 'situational';
}

function PracticeInner() {
  const params = useSearchParams();
  const initialType = isQuestionType(params.get('type'))
    ? (params.get('type') as QuestionType)
    : undefined;

  const [stage, setStage] = React.useState<Stage>('setup');
  const [settings, setSettings] = React.useState<SetupValues | null>(null);
  const [question, setQuestion] = React.useState<GeneratedQuestion | null>(
    null,
  );
  const [submittedAnswer, setSubmittedAnswer] = React.useState<SubmittedAnswer>(
    {},
  );
  const [feedback, setFeedback] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [feedbackError, setFeedbackError] = React.useState<string | null>(null);
  const [loadingQuestion, setLoadingQuestion] = React.useState(false);

  async function generateQuestion(values: SetupValues) {
    setLoadingQuestion(true);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: values.type,
          difficulty: values.difficulty,
          answerMode: values.answerMode,
          jobDescription: values.jobDescription || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Could not generate question.');
        return;
      }
      setSettings(values);
      setQuestion(data as GeneratedQuestion);
      setSubmittedAnswer({});
      setFeedback('');
      setFeedbackError(null);
      setStage('question');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not generate question.',
      );
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function submitAnswer(ans: SubmittedAnswer) {
    if (!settings || !question) return;
    setSubmittedAnswer(ans);
    setFeedback('');
    setFeedbackError(null);
    setStreaming(true);
    setStage('feedback');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: settings.type,
          question: question.question,
          rubric: question.rubric,
          answerMode: settings.answerMode,
          answer: ans.text ?? '',
          options: question.options,
          selectedOptionId: ans.selectedOptionId,
          jobDescription: settings.jobDescription || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        let msg = 'Could not generate feedback.';
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        setFeedbackError(msg);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setFeedback((prev) => prev + chunk);
      }
    } catch (err) {
      setFeedbackError(
        err instanceof Error ? err.message : 'Could not generate feedback.',
      );
    } finally {
      setStreaming(false);
    }
  }

  function handleNewSameSettings() {
    if (!settings) {
      setStage('setup');
      return;
    }
    void generateQuestion(settings);
  }

  function handleStartOver() {
    setStage('setup');
    setQuestion(null);
    setSubmittedAnswer({});
    setFeedback('');
    setFeedbackError(null);
  }

  const stageLabel =
    stage === 'setup' ? 'Configure' : stage === 'question' ? 'Answer' : 'Review';

  return (
    <>
      <DocHeader
        eyebrow="New Session"
        title="Practice Console"
        subtitle={`Stage · ${stageLabel}`}
        meta={[
          {
            label: 'Category',
            value: settings ? settings.type : '—',
          },
          {
            label: 'Difficulty',
            value: settings ? settings.difficulty : '—',
          },
          {
            label: 'Mode',
            value: settings ? settings.answerMode : '—',
          },
        ]}
      />

      <div className="mt-8 mb-8">
        <ProgressSteps stage={stage} />
      </div>

      {stage === 'setup' && (
        <SetupForm
          onSubmit={generateQuestion}
          loading={loadingQuestion}
          initialType={initialType}
        />
      )}

      {stage === 'question' && settings && question && (
        <QuestionCard
          type={settings.type}
          difficulty={settings.difficulty}
          answerMode={settings.answerMode}
          question={question}
          onSubmit={submitAnswer}
          onBack={handleStartOver}
          submitting={streaming}
        />
      )}

      {stage === 'feedback' && settings && question && (
        <FeedbackPanel
          type={settings.type}
          question={question}
          submittedAnswer={submittedAnswer}
          feedback={feedback}
          streaming={streaming}
          error={feedbackError}
          onNewSameSettings={handleNewSameSettings}
          onStartOver={handleStartOver}
        />
      )}
    </>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="py-8 text-sm text-[var(--color-muted)]">Loading…</div>}>
      <PracticeInner />
    </Suspense>
  );
}
