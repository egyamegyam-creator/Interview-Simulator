import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-sidebar)] text-white hover:bg-black font-bold uppercase tracking-[0.14em]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)] font-semibold uppercase tracking-[0.12em]',
  ghost:
    'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] font-semibold uppercase tracking-[0.12em]',
  outline:
    'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] font-semibold uppercase tracking-[0.12em]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-[0.65rem] rounded-none',
  md: 'h-10 px-4 text-[0.72rem] rounded-none',
  lg: 'h-12 px-7 text-[0.78rem] rounded-none',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
