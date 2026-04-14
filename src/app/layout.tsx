import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interview Simulator — AI-powered practice',
  description:
    'Practice behavioral, case, and situational interview questions with streamed AI feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</div>
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
