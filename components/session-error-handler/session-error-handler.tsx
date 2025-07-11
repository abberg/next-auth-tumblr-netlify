'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SessionErrorHandlerProps {
  children: React.ReactNode;
}

export function SessionErrorHandler({ children }: SessionErrorHandlerProps) {
  const { data: session, status } = useSession();
  const [hasShownError, setHasShownError] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.error === 'RefreshTokenError' && !hasShownError) {
      setHasShownError(true);
      toast.error('Your session has expired. Please sign in again.', {
        duration: 10000,
        action: {
          label: 'Sign In',
          onClick: () => {
            signOut({ redirect: false }).then(() => {
              signIn('tumblr', { callbackUrl: '/' });
            });
          },
        },
      });
    }
  }, [session?.error, status, hasShownError]);

  // Reset error state when session changes
  useEffect(() => {
    if (status === 'authenticated' && !session?.error) {
      setHasShownError(false);
    }
  }, [session?.error, status]);

  return <>{children}</>;
}
