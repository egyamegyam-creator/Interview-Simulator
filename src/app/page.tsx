import { Hero } from '@/components/landing/Hero';
import { FeatureGrid } from '@/components/landing/FeatureGrid';

export default function HomePage() {
  return (
    <main>
      <nav className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
          <span>Interview Simulator</span>
        </div>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          Deploy your own →
        </a>
      </nav>

      <Hero />
      <FeatureGrid />

      <footer className="mt-16 border-t border-[var(--color-border)] pt-6 pb-4 text-center text-xs text-[var(--color-muted)]">
        Built with Next.js and the Anthropic API.
      </footer>
    </main>
  );
}
