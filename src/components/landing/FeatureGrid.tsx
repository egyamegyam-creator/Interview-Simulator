import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Behavioral — STAR',
    body: 'Tell-me-about-a-time questions with feedback graded against the STAR framework: Situation, Task, Action, Result.',
  },
  {
    title: 'Case / Open-ended',
    body: 'Analytical prompts that ask you to structure an approach. Feedback evaluates structure, assumptions, and conclusion.',
  },
  {
    title: 'Situational Judgment',
    body: 'Realistic workplace scenarios with 4 multiple-choice options. Feedback compares your choice against the best one.',
  },
  {
    title: 'Tailored to any role',
    body: 'Paste a job description URL or text, and questions reference the responsibilities, seniority, and domain of the role.',
  },
  {
    title: 'Two answer modes',
    body: 'Write a free-form response or pick from multiple-choice. Toggle per question depending on how you want to practice.',
  },
  {
    title: 'Streamed feedback',
    body: 'Feedback appears token-by-token so you can start reading immediately. Always includes strengths, gaps, and a model answer.',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {f.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
