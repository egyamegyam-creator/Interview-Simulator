import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse-soft bg-[var(--color-surface-alt)] border border-[var(--color-border)]',
        className,
      )}
      {...props}
    />
  );
}
