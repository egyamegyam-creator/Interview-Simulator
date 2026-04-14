import type {
  AnswerMode,
  Difficulty,
  McqOption,
  QuestionType,
} from './types';

const TYPE_BRIEF: Record<QuestionType, string> = {
  behavioral:
    'Behavioral interview question about a past experience. The candidate should answer using the STAR framework (Situation, Task, Action, Result). Ask about real workplace scenarios: leadership, conflict, failure, teamwork, influence, ambiguity, delivery under pressure, etc.',
  case: 'Open-ended case / analytical question asking the candidate to structure an approach to a business, product, technical, or strategic problem. Example shapes: "How would you estimate X?", "A metric dropped 20% — how would you investigate?", "Design a system for Y."',
  situational:
    'Situational judgment question posing a realistic hypothetical workplace scenario ("Imagine you are…", "What would you do if…"). Focuses on judgment, tradeoffs, and stakeholder awareness.',
};

const DIFFICULTY_BRIEF: Record<Difficulty, string> = {
  easy: 'Entry-level / early-career. Single-axis question, low ambiguity, answerable in 2–3 minutes.',
  medium:
    'Mid-career. Multiple considerations, some ambiguity, requires a structured answer.',
  hard: 'Senior / principal level. Highly ambiguous, cross-functional, requires tradeoff reasoning and executive framing.',
};

/** System prompt for question generation. Returned as a JSON-only response. */
export function buildQuestionSystemPrompt(
  type: QuestionType,
  difficulty: Difficulty,
  answerMode: AnswerMode,
): string {
  const mcqBlock =
    answerMode === 'mcq'
      ? `The user wants a MULTIPLE-CHOICE question. You MUST include an "options" array of EXACTLY 4 items, each with a unique id ("A","B","C","D"), a text (1–3 sentences describing the candidate's choice), an isBest boolean (EXACTLY ONE option must be true), and a rationale (1–2 sentences on why it is or isn't the best choice). Make the distractors plausible — each should reflect a real tradeoff or a common mistake.`
      : `The user wants a FREE-FORM question. Do NOT include an "options" field.`;

  return `You are an expert interview coach generating a single practice interview question.

Question category: ${TYPE_BRIEF[type]}
Difficulty: ${DIFFICULTY_BRIEF[difficulty]}
${mcqBlock}

You MUST respond with a single JSON object and NOTHING else — no prose, no markdown fences. The JSON must match this TypeScript type exactly:

type Response = {
  question: string;            // the interview question itself, 1–4 sentences
  rubric: string[];            // 3–6 short bullet points (~8–15 words each) listing what a strong answer should cover
  options?: {                  // present only for multiple-choice questions
    id: "A" | "B" | "C" | "D";
    text: string;
    isBest: boolean;
    rationale: string;
  }[];
};

Quality bar:
- The question should feel realistic and specific, not generic.
- Do NOT include the rubric inside the question text.
- For behavioral questions, phrase as "Tell me about a time…" / "Describe a situation where…".
- For case questions, phrase as an analytical prompt; be concrete about what you want the candidate to do.
- For situational questions, set up a clear scenario before asking the question.`;
}

/** User message for question generation. Includes the optional JD. */
export function buildQuestionUserPrompt(jobDescription?: string): string {
  if (!jobDescription?.trim()) {
    return 'Generate one practice question now. Respond with the JSON object only.';
  }
  const jd = jobDescription.trim().slice(0, 8000);
  return `The candidate is preparing for this specific role. Tailor the question to the responsibilities, seniority, and domain shown below — reference concrete aspects of the role where appropriate.

<job_description>
${jd}
</job_description>

Generate one practice question now. Respond with the JSON object only.`;
}

/** System prompt for the feedback call. Sets structure and tone. */
export function buildFeedbackSystemPrompt(type: QuestionType): string {
  const typeSpecific =
    type === 'behavioral'
      ? `This is a BEHAVIORAL question, so you MUST include a "## STAR Breakdown" section with four sub-bullets — **Situation**, **Task**, **Action**, **Result** — rating each as ✅ solid / ⚠️ thin / ❌ missing, and noting what was said (or what was absent).`
      : type === 'case'
        ? `This is a CASE / analytical question. Evaluate the candidate's **structure** (did they lay out a framework?), **assumptions** (made explicit?), **quantitative reasoning** (if relevant), and **conclusion / recommendation**.`
        : `This is a SITUATIONAL JUDGMENT question. Evaluate the candidate's **judgment**, **awareness of tradeoffs**, and **stakeholder considerations**. If they chose a multiple-choice option, explicitly compare their choice to the best option and to the distractors.`;

  return `You are an expert interview coach giving candid, actionable feedback.

${typeSpecific}

Your response MUST follow this exact Markdown structure — no preamble, no closing pleasantries:

## Score: N/10
One-sentence rationale for the score.

## Strengths
- Bullet points of what the candidate did well. Be specific — quote or paraphrase what they actually said. If the answer has no real strengths, say so.

## Areas for Improvement
- Bullet points of concrete gaps, against the rubric. Each bullet: what was missing + how to improve it.

${type === 'behavioral' ? '## STAR Breakdown\n- **Situation** — ✅/⚠️/❌ + one-sentence observation\n- **Task** — ✅/⚠️/❌ + one-sentence observation\n- **Action** — ✅/⚠️/❌ + one-sentence observation\n- **Result** — ✅/⚠️/❌ + one-sentence observation\n\n' : ''}## Suggested Stronger Answer
A tight 3–5 sentence model answer showing the shape of what a strong response looks like. Do not copy the candidate's wording — demonstrate the structure they should aim for.

Tone: direct, encouraging, no fluff. Do not start with "Great answer!" or similar filler.`;
}

/** Build the user-side feedback message. */
export function buildFeedbackUserPrompt(opts: {
  question: string;
  rubric: string[];
  answerMode: AnswerMode;
  answer: string;
  options?: McqOption[];
  selectedOptionId?: 'A' | 'B' | 'C' | 'D';
  jobDescription?: string;
}): string {
  const { question, rubric, answerMode, answer, options, selectedOptionId, jobDescription } =
    opts;

  const jdBlock = jobDescription?.trim()
    ? `\n<job_description>\n${jobDescription.trim().slice(0, 8000)}\n</job_description>\n`
    : '';

  const rubricBlock =
    rubric.length > 0
      ? `\n<rubric>\n${rubric.map((r) => `- ${r}`).join('\n')}\n</rubric>\n`
      : '';

  if (answerMode === 'mcq' && options && selectedOptionId) {
    const best = options.find((o) => o.isBest);
    const chosen = options.find((o) => o.id === selectedOptionId);
    const optionsBlock = options
      .map(
        (o) =>
          `  ${o.id}. ${o.text}${o.isBest ? ' [BEST]' : ''}\n     rationale: ${o.rationale}`,
      )
      .join('\n');
    return `${jdBlock}<question>\n${question}\n</question>
${rubricBlock}
<options>
${optionsBlock}
</options>

<candidate_choice>${selectedOptionId}</candidate_choice>
<candidate_choice_text>${chosen?.text ?? ''}</candidate_choice_text>
<best_option>${best?.id ?? ''}</best_option>

Evaluate the candidate's choice against the best option and explain the reasoning tradeoffs. Follow the required Markdown structure.`;
  }

  return `${jdBlock}<question>\n${question}\n</question>
${rubricBlock}
<candidate_answer>
${answer.trim() || '(empty)'}
</candidate_answer>

Evaluate this answer. Follow the required Markdown structure exactly.`;
}
