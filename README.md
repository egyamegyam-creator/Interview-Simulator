# Behavioral Interview Simulator

A Next.js app for practicing interview questions (behavioral / case / situational judgment) with streamed AI feedback from the Anthropic API.

## Features

- **Three question categories** — behavioral (STAR), open-ended case, situational judgment.
- **Three difficulty levels** — Easy, Medium, Hard.
- **Job-description mode** — paste a URL (server-side scraped) or the JD text, and questions are tailored to the role.
- **Two answer modes** — free-form text or multiple-choice (4 options, one best).
- **Streamed AI feedback** — strengths, areas for improvement, and a full STAR breakdown for behavioral answers.

## Local setup

```bash
pnpm install           # or: npm install / yarn
cp .env.example .env.local
# open .env.local and paste your key after ANTHROPIC_API_KEY=
pnpm dev
```

Visit http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project on Vercel.
3. Under **Settings → Environment Variables**, add `ANTHROPIC_API_KEY` (the value of your Anthropic API key).
4. Deploy.

No database, no auth — the app is fully stateless.

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Anthropic TypeScript SDK + Vercel AI SDK (for streaming)
- Zod for validation, cheerio for JD URL scraping, sonner for toasts
