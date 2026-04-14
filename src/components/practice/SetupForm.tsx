'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
}

export function SetupForm({ onSubmit, loading }: Props) {
  const [type, setType] = React.useState<QuestionType>('behavioral');
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium');
  const [answerMode, setAnswerMode] = React.useState<AnswerMode>('free');
  const [jdTab, setJdTab] = React.useState<'link' | 'text' | 'none'>('none');
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
      toast.error(
        err instanceof Error ? err.message : 'Could not fetch URL.',
      );
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Set up your practice question</CardTitle>
          <CardDescription>
            Pick a category, difficulty, and answer mode. Optionally add a job
            description to tailor the question.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Question type</Label>
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
            <p className="text-sm text-[var(--color-muted)]">
              {QUESTION_TYPE_DESCRIPTIONS[type]}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Difficulty</Label>
            <Segmented<Difficulty>
              ariaLabel="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={(['easy', 'medium', 'hard'] as const).map((d) => ({
                value: d,
                label: DIFFICULTY_LABELS[d],
              }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Answer mode</Label>
            <Segmented<AnswerMode>
              ariaLabel="Answer mode"
              value={answerMode}
              onChange={setAnswerMode}
              options={[
                { value: 'free', label: 'Free-form' },
                { value: 'mcq', label: 'Multiple choice' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Job description (optional)</Label>
            <Tabs
              value={jdTab}
              onValueChange={(v) => setJdTab(v as typeof jdTab)}
            >
              <TabsList>
                <TabsTrigger value="none">None</TabsTrigger>
                <TabsTrigger value="link">Paste link</TabsTrigger>
                <TabsTrigger value="text">Paste text</TabsTrigger>
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
                  fails, switch to "Paste text".
                </p>
                {jdText && (
                  <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 max-h-40 overflow-y-auto text-xs text-[var(--color-muted)] whitespace-pre-wrap">
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
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? 'Generating question…' : 'Generate question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
