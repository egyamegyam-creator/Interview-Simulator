import { cn } from '@/lib/utils';

const steps = [
  { key: 'setup', label: 'Configure' },
  { key: 'question', label: 'Answer' },
  { key: 'feedback', label: 'Review' },
] as const;

export type Stage = (typeof steps)[number]['key'];

export function ProgressSteps({ stage }: { stage: Stage }) {
  const currentIdx = steps.findIndex((s) => s.key === stage);
  return (
    <ol className="flex items-center gap-6">
      {steps.map((s, i) => {
        const active = i === currentIdx;
        const complete = i < currentIdx;
        return (
          <li key={s.key} className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center text-[0.65rem] font-bold',
                active &&
                  'bg-[var(--color-sidebar)] text-white',
                complete &&
                  'bg-[var(--color-surface-alt)] text-[var(--color-accent)] border border-[var(--color-accent)]',
                !active &&
                  !complete &&
                  'border border-[var(--color-border-strong)] text-[var(--color-muted)]',
              )}
            >
              {complete ? '✓' : `0${i + 1}`}
            </span>
            <span
              className={cn(
                'text-[0.7rem] font-bold uppercase tracking-[0.14em]',
                active
                  ? 'text-[var(--color-text)]'
                  : 'text-[var(--color-muted)]',
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="ml-2 h-px w-8 bg-[var(--color-border-strong)]"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
