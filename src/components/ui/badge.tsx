import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'red'
  | 'green'
  | 'orange'
  | 'blue'
  | 'purple';

const tones: Record<Tone, string> = {
  default:
    'border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] text-[var(--color-muted)]',
  accent:
    'border-transparent bg-[var(--color-accent)] text-white',
  success:
    'border-transparent bg-[var(--color-success)] text-white',
  warning:
    'border-transparent bg-[var(--color-warning)] text-white',
  danger:
    'border-transparent bg-[var(--color-danger)] text-white',
  red: 'border-transparent bg-[var(--color-tag-red)] text-white',
  green: 'border-transparent bg-[var(--color-tag-green)] text-white',
  orange: 'border-transparent bg-[var(--color-tag-orange)] text-white',
  blue: 'border-transparent bg-[var(--color-tag-blue)] text-white',
  purple: 'border-transparent bg-[var(--color-tag-purple)] text-white',
};

export function Badge({
  tone = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
