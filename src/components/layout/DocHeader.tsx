import { cn } from '@/lib/utils';

export interface MetaItem {
  label: string;
  value: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: MetaItem[];
  className?: string;
}

/**
 * Document-style header block — big black uppercase title, blue subtitle,
 * right-aligned labeled metadata. Matches the consulting-doc aesthetic.
 */
export function DocHeader({
  eyebrow,
  title,
  subtitle,
  meta,
  className,
}: Props) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 border-b border-[var(--color-border-strong)] pb-8 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div>
        {eyebrow && (
          <div className="label-eyebrow mb-3 text-[var(--color-accent)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--color-text)] leading-[0.95]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {subtitle}
          </p>
        )}
      </div>

      {meta && meta.length > 0 && (
        <dl className="grid grid-cols-1 gap-x-10 gap-y-2 text-xs sm:text-right sm:grid-cols-1">
          {meta.map((m) => (
            <div
              key={m.label}
              className="flex items-baseline gap-3 sm:justify-end"
            >
              <dt className="label-eyebrow">{m.label}</dt>
              <dd className="font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-5 mt-10">
      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-text)]">
        {title}
      </h2>
      {action}
    </div>
  );
}
