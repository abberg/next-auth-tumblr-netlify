import { AuthErrorBoundary } from '@/components/auth-error-boundary';
import { AuthProvider } from '@/components/auth-provider';
import { SessionErrorHandler } from '@/components/session-error-handler';
import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Tumblr Dashboard',
  description: 'Next.js app router with Auth.js and Tumblr API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.className}>
        <AuthProvider>
          <SessionErrorHandler>
            <AuthErrorBoundary>{children}</AuthErrorBoundary>
          </SessionErrorHandler>
        </AuthProvider>
        <Toaster
          icons={{
            error: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4 text-red-600"
                aria-hidden={true}
              >
                <path
                  fillRule="evenodd"
                  d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
            ),
          }}
        />
      </body>
    </html>
  );
}
