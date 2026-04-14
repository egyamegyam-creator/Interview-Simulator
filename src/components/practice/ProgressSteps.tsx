import { cn } from '@/lib/utils';

const steps = [
  { key: 'setup', label: 'Setup' },
  { key: 'question', label: 'Question' },
  { key: 'feedback', label: 'Feedback' },
] as const;

export type Stage = (typeof steps)[number]['key'];

export function ProgressSteps({ stage }: { stage: Stage }) {
  const currentIdx = steps.findIndex((s) => s.key === stage);
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => {
        const active = i === currentIdx;
        const complete = i < currentIdx;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                active &&
                  'bg-[var(--color-accent)] border-[var(--color-accent)] text-[#0b0d12]',
                complete &&
                  'bg-[var(--color-surface-2)] border-[var(--color-success)] text-[var(--color-success)]',
                !active &&
                  !complete &&
                  'border-[var(--color-border)] text-[var(--color-muted)]',
              )}
            >
              {complete ? '✓' : i + 1}
            </span>
            <span
              className={cn(
                active
                  ? 'text-[var(--color-text)] font-medium'
                  : 'text-[var(--color-muted)]',
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-2 h-px w-6 bg-[var(--color-border)]" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
