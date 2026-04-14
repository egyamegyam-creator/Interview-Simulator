import { NextResponse } from 'next/server';
import { getAnthropic, MODEL } from '@/lib/anthropic';
import {
  buildQuestionSystemPrompt,
  buildQuestionUserPrompt,
} from '@/lib/prompts';
import {
  generateQuestionsRequestSchema,
  generatedQuestionSchema,
} from '@/lib/schemas';

export const runtime = 'nodejs';
export const maxDuration = 60;

function extractText(content: unknown): string {
  if (!Array.isArray(content)) return '';
  return content
    .filter(
      (block): block is { type: 'text'; text: string } =>
        typeof block === 'object' &&
        block !== null &&
        (block as { type?: string }).type === 'text',
    )
    .map((block) => block.text)
    .join('');
}

/** Strip any stray markdown fences or preamble around the JSON payload. */
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = generateQuestionsRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { type, difficulty, answerMode, jobDescription } = parsed.data;

  let anthropic: ReturnType<typeof getAnthropic>;
  try {
    anthropic = getAnthropic();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server misconfigured.' },
      { status: 500 },
    );
  }

  const systemPrompt = buildQuestionSystemPrompt(type, difficulty, answerMode);
  const userPrompt = buildQuestionUserPrompt(jobDescription);

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: [
        { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        { role: 'user', content: userPrompt },
        // Assistant prefill to nudge JSON-only output.
        { role: 'assistant', content: '{' },
      ],
    });

    const text = '{' + extractText(msg.content);
    const cleaned = extractJson(text);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Model returned non-JSON output. Try again.' },
        { status: 422 },
      );
    }

    const shape = generatedQuestionSchema.safeParse(parsedJson);
    if (!shape.success) {
      return NextResponse.json(
        {
          error: 'Model output did not match expected shape.',
          details: shape.error.flatten(),
        },
        { status: 422 },
      );
    }

    // Extra guard: for MCQ, exactly one isBest.
    if (shape.data.options) {
      const bestCount = shape.data.options.filter((o) => o.isBest).length;
      if (bestCount !== 1) {
        return NextResponse.json(
          { error: 'Model produced an MCQ without exactly one best option.' },
          { status: 422 },
        );
      }
    }

    return NextResponse.json(shape.data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return NextResponse.json(
      { error: `Question generation failed: ${message}` },
      { status: 502 },
    );
  }
}
