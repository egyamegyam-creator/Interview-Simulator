import * as React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text)]',
      className,
    )}
    {...props}
  />
));
Label.displayName = 'Label';
