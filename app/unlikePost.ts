'use server';
import { auth } from '@/auth';

export async function unlikePost({
  id,
  reblog_key,
}: { id: string; reblog_key: string }) {
  const session = await auth();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('https://api.tumblr.com/v2/user/unlike', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, reblog_key }),
  });

  if (!res.ok) {
    throw new Error('Failed to unlike post');
  }
  return await res.json();
}
