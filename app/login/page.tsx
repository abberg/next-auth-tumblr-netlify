'use client';
import { LoginBox } from '@/components/login-box';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <LoginBox onAuthorize={() => signIn('tumblr', { callbackUrl: '/' })} />
  );
}
