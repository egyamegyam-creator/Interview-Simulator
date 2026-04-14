'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Segmented } from '@/components/ui/segmented';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_DESCRIPTIONS,
  QUESTION_TYPE_LABELS,
  type AnswerMode,
  type Difficulty,
  type QuestionType,
} from '@/lib/types';

export interface SetupValues {
  type: QuestionType;
  difficulty: Difficulty;
  answerMode: AnswerMode;
  jobDescription: string;
}

interface Props {
  onSubmit: (values: SetupValues) => void;
  loading: boolean;
  initialType?: QuestionType;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-[var(--color-border)] pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-10">
      <div>
        <Label className="block">{label}</Label>
        {hint && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SetupForm({ onSubmit, loading, initialType }: Props) {
  const [type, setType] = React.useState<QuestionType>(
    initialType ?? 'behavioral',
  );
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
  const [answerMode, setAnswerMode] = React.useState<AnswerMode>('free');
  const [jdTab, setJdTab] = React.useState<'none' | 'link' | 'text'>('none');
  const [jdUrl, setJdUrl] = React.useState('');
  const [jdText, setJdText] = React.useState('');
  const [scrapeLoading, setScrapeLoading] = React.useState(false);

  async function handleFetchJd() {
    const url = jdUrl.trim();
    if (!url) return;
    setScrapeLoading(true);
    try {
      const res = await fetch('/api/scrape-jd', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Could not fetch URL.');
        setJdTab('text');
        return;
      }
      setJdText(data.text);
      setJdTab('text');
      toast.success('Job description loaded. Review or edit below.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not fetch URL.');
      setJdTab('text');
    } finally {
      setScrapeLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      type,
      difficulty,
      answerMode,
      jobDescription: jdTab !== 'none' ? jdText.trim() : '',
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8"
    >
      <div className="mb-6 border-b border-[var(--color-border)] pb-4">
        <div className="label-eyebrow text-[var(--color-accent)]">
          New Session · Configuration
        </div>
        <h2 className="mt-1 text-xl font-bold uppercase tracking-tight">
          Session Parameters
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Select a category, difficulty, and answer mode. A job description is
          optional and tailors every question to the role.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Field label="Category" hint={QUESTION_TYPE_DESCRIPTIONS[type]}>
          <Segmented<QuestionType>
            ariaLabel="Question type"
            value={type}
            onChange={setType}
            options={[
              { value: 'behavioral', label: 'Behavioral' },
              { value: 'case', label: 'Case' },
              { value: 'situational', label: 'Situational' },
            ]}
          />
        </Field>

        <Field label="Difficulty" hint="Higher tiers increase ambiguity and scope.">
          <Segmented<Difficulty>
            ariaLabel="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
            options={(['easy', 'medium', 'hard'] as const).map((d) => ({
              value: d,
              label: DIFFICULTY_LABELS[d],
            }))}
          />
        </Field>

        <Field label="Answer Mode" hint="Free-form text or 4 multiple-choice options.">
          <Segmented<AnswerMode>
            ariaLabel="Answer mode"
            value={answerMode}
            onChange={setAnswerMode}
            options={[
              { value: 'free', label: 'Free-form' },
              { value: 'mcq', label: 'Multiple choice' },
            ]}
          />
        </Field>

        <Field
          label="Job Description"
          hint="Optional. Paste the URL or text to tailor the question."
        >
          <Tabs
            value={jdTab}
            onValueChange={(v) => setJdTab(v as typeof jdTab)}
          >
            <TabsList>
              <TabsTrigger value="none">None</TabsTrigger>
              <TabsTrigger value="link">Paste Link</TabsTrigger>
              <TabsTrigger value="text">Paste Text</TabsTrigger>
            </TabsList>

            <TabsContent value="none">
              <p className="text-sm text-[var(--color-muted)]">
                Question will be generic for {QUESTION_TYPE_LABELS[type]}.
              </p>
            </TabsContent>

            <TabsContent value="link">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="url"
                  placeholder="https://jobs.example.com/posting/123"
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFetchJd}
                  disabled={scrapeLoading || !jdUrl.trim()}
                >
                  {scrapeLoading ? 'Fetching…' : 'Fetch'}
                </Button>
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Some job boards (LinkedIn, Indeed) block scrapers. If fetch
                fails, switch to &quot;Paste Text&quot;.
              </p>
              {jdText && (
                <div className="mt-4 max-h-40 overflow-y-auto border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-xs text-[var(--color-muted)] whitespace-pre-wrap">
                  {jdText.slice(0, 1500)}
                  {jdText.length > 1500 && '…'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="text">
              <Textarea
                rows={7}
                placeholder="Paste the job description text here…"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {jdText.length.toLocaleString()} characters
              </p>
            </TabsContent>
          </Tabs>
        </Field>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border-strong)] pt-6">
        <p className="text-xs text-[var(--color-muted)]">
          Questions are generated on demand. Nothing is stored.
        </p>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Generating…' : 'Generate Question →'}
        </Button>
      </div>
    </form>
  );
}
