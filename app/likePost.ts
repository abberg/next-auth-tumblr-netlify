'use server';
import { auth } from '@/auth';
import { tumblrRequest } from './tumblrClient';

export async function likePost({
  id,
  reblog_key,
}: { id: string; reblog_key: string }) {
  const session = await auth();
  const token = session?.access_token;
  const queueKey = session?.user?.id ?? session?.user?.name ?? 'anonymous';
  if (session?.error === 'RefreshTokenError')
    throw new Error('Not authenticated');
  if (session?.error === 'TemporaryRefreshError') {
    throw new Error('Temporary authentication issue. Please retry shortly.');
  }
  if (!token) throw new Error('Not authenticated');

  await tumblrRequest({
    token,
    method: 'POST',
    path: '/user/like',
    body: { id, reblog_key },
    queueKey,
  });

  return { meta: { status: 200 } };
}
