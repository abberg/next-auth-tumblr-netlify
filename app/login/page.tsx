'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        type="button"
        onClick={() => signIn('tumblr', { callbackUrl: '/' })}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Sign in with Tumblr
      </button>
    </div>
  );
}
