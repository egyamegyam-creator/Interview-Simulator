import { NextResponse } from 'next/server';
import { scrapeJobDescription } from '@/lib/scrape';
import { scrapeJdRequestSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = scrapeJdRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please provide a valid URL.' },
      { status: 400 },
    );
  }

  try {
    const text = await scrapeJobDescription(parsed.data.url);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return NextResponse.json(
      {
        error: `Could not fetch that URL (${message}). Paste the job description text below instead.`,
      },
      { status: 422 },
    );
  }
}
