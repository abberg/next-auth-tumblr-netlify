'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const { data: session, status } = useSession();
  const [hasAuthError, setHasAuthError] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.error === 'RefreshTokenError') {
      setHasAuthError(true);
    } else {
      setHasAuthError(false);
    }
  }, [session?.error, status]);

  if (hasAuthError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mb-2 font-semibold text-gray-900 text-xl">
              Session Expired
            </h2>
            <p className="text-gray-600">
              Your session has expired. Please sign in again to continue.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signIn('tumblr', { callbackUrl: '/' })}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
