import * as cheerio from 'cheerio';

const MAX_BYTES = 1_000_000; // 1 MB
const FETCH_TIMEOUT_MS = 8_000;
const MAX_OUTPUT_CHARS = 8_000;

/** Basic SSRF guard: reject localhost, private IPs, non-http(s) schemes. */
function assertPublicHttpUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are supported.');
  }
  const host = url.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host.endsWith('.localhost') ||
    host.endsWith('.internal') ||
    host === '::1'
  ) {
    throw new Error('URL host is not allowed.');
  }
  // Reject raw IPv4 private/loopback ranges.
  const v4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (v4) {
    const [a, b] = v4.slice(1).map(Number) as [number, number, number, number];
    if (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      throw new Error('URL host is not allowed.');
    }
  }
  return url;
}

export async function scrapeJobDescription(rawUrl: string): Promise<string> {
  const url = assertPublicHttpUrl(rawUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; InterviewSimBot/1.0; +https://example.com/bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Fetch failed: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new Error(`Unsupported content-type: ${contentType || 'unknown'}`);
  }

  // Cap bytes read.
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty response body');
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_BYTES) {
        try {
          await reader.cancel();
        } catch {
          /* ignore */
        }
        break;
      }
      chunks.push(value);
    }
  }
  const buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  const html = buffer.toString('utf8');

  return extractReadableText(html);
}

export function extractReadableText(html: string): string {
  const $ = cheerio.load(html);
  // Drop non-content chrome.
  $(
    'script, style, noscript, nav, header, footer, form, iframe, svg, aside, button',
  ).remove();

  // Prefer <main> or the most text-heavy <article>; fall back to body.
  // If none exist, $('body').text() returns '' and the length guard below fires.
  let root = $('main').first();
  if (root.length === 0) root = $('article').first();
  if (root.length === 0) root = $('body');

  const text = root
    .text()
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  if (text.length < 80) {
    throw new Error(
      'Could not extract meaningful text from the page. Try pasting the job description directly.',
    );
  }

  return text.slice(0, MAX_OUTPUT_CHARS);
}
