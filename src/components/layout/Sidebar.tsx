'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  /** When true, active state requires exact path match; otherwise startsWith. */
  exact?: boolean;
}

const NAV: NavItem[] = [
  { label: 'Overview', href: '/', exact: true },
  { label: 'Practice', href: '/practice' },
  { label: 'STAR Method', href: '/#star' },
  { label: 'Case Prep', href: '/#case' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/#about' },
];

export function Sidebar() {
  const pathname = usePathname() ?? '/';

  return (
    <aside className="flex h-full flex-col bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)]">
      <div className="px-7 pt-8 pb-8">
        <Link href="/" className="inline-flex flex-col">
          <span className="text-2xl font-black tracking-tight text-white">
            PREP.
          </span>
          <span
            aria-hidden
            className="mt-2 h-[2px] w-10 bg-[var(--color-sidebar-accent)]"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-4">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors',
                active
                  ? 'text-[var(--color-sidebar-text-active)] bg-[var(--color-sidebar-alt)]'
                  : 'hover:text-[var(--color-sidebar-text-active)]',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-7 pb-6 pt-10 text-[0.65rem] leading-relaxed text-[var(--color-sidebar-text)]/70">
        <p className="font-bold uppercase tracking-[0.14em] text-[var(--color-sidebar-text)]/80">
          Build No.
        </p>
        <p className="mt-1">v0.1 · Interview Co.</p>
        <p className="mt-4 font-bold uppercase tracking-[0.14em] text-[var(--color-sidebar-text)]/80">
          Model
        </p>
        <p className="mt-1">Claude Sonnet 4.6</p>
      </div>
    </aside>
  );
}

export function MobileTopbar() {
  return (
    <header className="lg:hidden flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-sidebar)] px-5 py-4 text-white">
      <Link href="/" className="text-lg font-black tracking-tight">
        PREP.
      </Link>
      <div className="flex items-center gap-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--color-sidebar-text)]">
        <Link href="/" className="hover:text-white">
          Overview
        </Link>
        <Link href="/practice" className="hover:text-white">
          Practice
        </Link>
      </div>
    </header>
  );
}
