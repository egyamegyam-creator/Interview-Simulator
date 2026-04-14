import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { MobileTopbar, Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PREP. — Interview Simulator',
  description:
    'Practice behavioral, case, and situational interview questions with streamed AI feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
          <MobileTopbar />
          <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <Sidebar />
          </div>
          <main className="bg-[var(--color-bg)] px-6 sm:px-10 lg:px-14 py-8 sm:py-12">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
        <Toaster
          theme="light"
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: '0',
              border: '1px solid var(--color-border-strong)',
            },
          }}
        />
      </body>
    </html>
  );
}
