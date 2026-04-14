import { anthropic as anthropicProvider } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { MODEL } from '@/lib/anthropic';
import {
  buildFeedbackSystemPrompt,
  buildFeedbackUserPrompt,
} from '@/lib/prompts';
import { feedbackRequestSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          'ANTHROPIC_API_KEY is not set. Add it to .env.local or your Vercel env vars.',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid request.', details: parsed.error.flatten() }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const {
    type,
    question,
    rubric,
    answerMode,
    answer,
    options,
    selectedOptionId,
    jobDescription,
  } = parsed.data;

  if (answerMode === 'mcq' && (!options || !selectedOptionId)) {
    return new Response(
      JSON.stringify({
        error: 'MCQ feedback requires both options and selectedOptionId.',
      }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }
  if (answerMode === 'free' && answer.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: 'Free-form answer cannot be empty.' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const systemPrompt = buildFeedbackSystemPrompt(type);
  const userPrompt = buildFeedbackUserPrompt({
    question,
    rubric,
    answerMode,
    answer,
    options,
    selectedOptionId,
    jobDescription,
  });

  try {
    const result = streamText({
      model: anthropicProvider(MODEL),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 1800,
      temperature: 0.4,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return new Response(
      JSON.stringify({ error: `Feedback generation failed: ${message}` }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }
}
