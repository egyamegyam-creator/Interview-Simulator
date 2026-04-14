import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="py-16 sm:py-24 text-center">
      <Badge tone="accent" className="mb-6">
        Powered by Claude
      </Badge>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-[#e7eaf0] to-[#a78bfa] bg-clip-text text-transparent mb-6">
        Practice interviews that feel real.
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted)] mb-10">
        Generate behavioral, case, and situational judgment questions tailored
        to any job description. Answer in your own words or pick from
        multiple-choice, then get streamed, actionable feedback.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/practice">
          <Button size="lg">Start practicing →</Button>
        </Link>
        <a
          href="https://docs.anthropic.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Button size="lg" variant="outline">
            How it works
          </Button>
        </a>
      </div>
    </section>
  );
}
