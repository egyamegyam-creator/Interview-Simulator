'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  ariaLabel?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex border border-[var(--color-border-strong)] bg-[var(--color-surface)]',
        className,
      )}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors',
              i > 0 && 'border-l border-[var(--color-border-strong)]',
              active
                ? 'bg-[var(--color-sidebar)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
            )}
            title={opt.description}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
