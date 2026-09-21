'use server';

import { tumblrRequest } from '@/app/tumblrClient';
import { auth } from '@/auth';
import type { TumblrResponse } from '@/types/tumblr';
import { analyzeCursor } from './analyze';

// An experiment, not a production pagination contract. Never expose tokens or post content.
export async function probeDashboardCursor(savedAnchor?: string) {
  if (process.env.NODE_ENV !== 'development')
    throw new Error('Development only');
  if (savedAnchor !== undefined && !/^\d{1,25}$/.test(savedAnchor)) {
    throw new Error('Invalid anchor');
  }
  const session = await auth();
  if (!session?.access_token || session.error)
    throw new Error('Please sign in again before running the test.');
  const token = session.access_token;
  const queueKey = session.user?.id ?? session.user?.name ?? 'anonymous';
  const read = async (beforeId?: string) => {
    const data = await tumblrRequest<TumblrResponse>({
      token,
      queueKey,
      path: '/user/dashboard',
      // Deliberately omit offset when probing the cursor.
      params: {
        limit: '18',
        npf: 'true',
        ...(beforeId ? { before_id: beforeId } : {}),
      },
    });
    return data.response.posts.map((post) => post.id_string);
  };

  if (savedAnchor) {
    const currentHead = await read();
    return {
      anchor: savedAnchor,
      newestId: currentHead[0] ?? null,
      checkedAt: new Date().toISOString(),
      first: analyzeCursor(savedAnchor, await read(savedAnchor)),
      repeated: null,
      tail: null,
    };
  }
  const baseline = await read();
  if (baseline.length < 3)
    throw new Error('Too few dashboard posts for a meaningful cursor test.');
  const midpoint = Math.floor(baseline.length / 2);
  const anchor = baseline[midpoint];
  const expected = baseline.slice(midpoint + 1);
  const first = analyzeCursor(anchor, await read(anchor), expected);
  const tailAnchor = baseline[baseline.length - 1];
  const tail = {
    anchor: tailAnchor,
    ...analyzeCursor(tailAnchor, await read(tailAnchor)),
  };
  const repeated = analyzeCursor(anchor, await read(anchor), expected);
  return {
    anchor,
    newestId: baseline[0],
    checkedAt: new Date().toISOString(),
    first,
    repeated,
    tail,
  };
}
