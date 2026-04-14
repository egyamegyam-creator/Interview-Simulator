import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Format {
  tag: 'STAR' | 'CASE' | 'SJT' | 'JD';
  tagTone: 'red' | 'green' | 'orange' | 'blue';
  title: string;
  meta: string;
  description: string;
  href: string;
}

const formats: Format[] = [
  {
    tag: 'STAR',
    tagTone: 'red',
    title: 'behavioral_questions.fmt',
    meta: 'Tell-me-about-a-time · STAR-evaluated',
    description:
      'Past-experience questions graded against Situation, Task, Action, Result.',
    href: '/practice?type=behavioral',
  },
  {
    tag: 'CASE',
    tagTone: 'green',
    title: 'case_questions.fmt',
    meta: 'Open-ended · Structure · Assumptions · Conclusion',
    description:
      'Analytical prompts asking you to lay out a framework and recommendation.',
    href: '/practice?type=case',
  },
  {
    tag: 'SJT',
    tagTone: 'orange',
    title: 'situational_judgment.fmt',
    meta: 'Hypothetical scenarios · Free-form or MCQ',
    description:
      'Realistic workplace dilemmas testing judgment and stakeholder awareness.',
    href: '/practice?type=situational',
  },
  {
    tag: 'JD',
    tagTone: 'blue',
    title: 'job_description.input',
    meta: 'URL scrape + text paste · Role-tailored questions',
    description:
      'Drop a posting and questions reference the role directly. Bot-blocked pages fall back to text paste.',
    href: '/practice',
  },
];

export function FormatGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {formats.map((f) => (
        <Link
          key={f.tag}
          href={f.href}
          className="group flex items-start gap-4 border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <Badge tone={f.tagTone} className="shrink-0 w-14 justify-center">
            {f.tag}
          </Badge>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-sm font-semibold text-[var(--color-text)] truncate">
              {f.title}
            </div>
            <div className="mt-0.5 text-xs text-[var(--color-muted)]">
              {f.meta}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
              {f.description}
            </p>
          </div>
          <span
            aria-hidden
            className="mt-1 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-text)]"
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
