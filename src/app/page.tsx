import Link from 'next/link';
import { CapabilityList } from '@/components/landing/CapabilityList';
import { FormatGrid } from '@/components/landing/FormatGrid';
import { DocHeader, SectionHeader } from '@/components/layout/DocHeader';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <DocHeader
        eyebrow="Strategic Interview Preparation · 2026"
        title="Interview Simulator"
        subtitle="Behavioral · Case · Situational Judgment"
        meta={[
          { label: 'Status', value: 'Active' },
          { label: 'Model', value: 'Claude Sonnet 4.6' },
          { label: 'Session ID', value: '#PREP-001' },
        ]}
      />

      <SectionHeader
        title="Current Capabilities"
        action={
          <Link href="/practice">
            <Button size="sm">Start new session →</Button>
          </Link>
        }
      />
      <CapabilityList />

      <SectionHeader title="Latest Formats" />
      <FormatGrid />

      <section id="how-it-works" className="mt-16">
        <SectionHeader title="How It Works" />
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Configure',
              body: 'Pick a question type, difficulty, and answer mode. Optionally drop in a job description.',
            },
            {
              step: '02',
              title: 'Answer',
              body: 'Write a free-form response or select from four multiple-choice options.',
            },
            {
              step: '03',
              title: 'Review',
              body: 'Read streamed feedback with strengths, gaps, STAR breakdown, and a model answer.',
            },
          ].map((s) => (
            <li
              key={s.step}
              className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5"
            >
              <div className="label-eyebrow text-[var(--color-accent)]">
                Step {s.step}
              </div>
              <h3 className="mt-2 text-base font-bold uppercase tracking-wide">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="star" className="mt-16">
        <SectionHeader title="The STAR Framework" />
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { letter: 'S', name: 'Situation', body: 'Set the scene and context briefly.' },
            { letter: 'T', name: 'Task', body: 'Your responsibility or challenge.' },
            { letter: 'A', name: 'Action', body: 'Specific steps you personally took.' },
            { letter: 'R', name: 'Result', body: 'The outcome, ideally quantified.' },
          ].map((s) => (
            <div
              key={s.letter}
              className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5"
            >
              <div className="text-4xl font-black text-[var(--color-accent)]">
                {s.letter}
              </div>
              <div className="mt-2 label-eyebrow">{s.name}</div>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="case" className="mt-16">
        <SectionHeader title="Case Prep" />
        <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 text-sm leading-relaxed text-[var(--color-muted)]">
          Case questions reward <strong className="text-[var(--color-text)]">structure</strong> over cleverness. Lay out your approach before diving in, make assumptions explicit, and show quantitative reasoning when relevant. The simulator evaluates framework, assumptions, and conclusion against a dedicated rubric.
        </div>
      </section>

      <section id="about" className="mt-16 mb-4">
        <SectionHeader title="About" />
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          Built with Next.js and the Anthropic API. Questions and feedback are generated on demand — nothing is stored. Add your <code className="font-mono">ANTHROPIC_API_KEY</code> to run locally or deploy to Vercel.
        </p>
      </section>

      <footer className="mt-16 border-t border-[var(--color-border-strong)] pt-6 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        PREP. · Interview Simulator · v0.1
      </footer>
    </>
  );
}
