import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-sonnet-4-6';

let _client: Anthropic | null = null;

/**
 * Lazily-constructed Anthropic client. Throws a readable error at call time
 * (not at module load) if ANTHROPIC_API_KEY is missing — lets `next build`
 * succeed on a dev machine without the key set.
 */
export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to .env.local for local dev, or to your Vercel project environment variables.',
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}
