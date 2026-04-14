import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'danger';

const tones: Record<Tone, string> = {
  default:
    'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]',
  accent:
    'border-[rgba(167,139,250,0.35)] bg-[rgba(167,139,250,0.12)] text-[var(--color-accent)]',
  success:
    'border-[rgba(52,211,153,0.35)] bg-[rgba(52,211,153,0.12)] text-[var(--color-success)]',
  warning:
    'border-[rgba(251,191,36,0.35)] bg-[rgba(251,191,36,0.12)] text-[var(--color-warning)]',
  danger:
    'border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] text-[var(--color-danger)]',
};

export function Badge({
  tone = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
