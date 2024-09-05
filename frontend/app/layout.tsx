import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import AuthProvider from '@/components/providers/AuthProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'YouTube Sharing',
  description: 'Share YouTube videos with your friends and family.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            'min-h-dvh bg-background font-sans antialiased',
            fontSans.variable,
          )}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
