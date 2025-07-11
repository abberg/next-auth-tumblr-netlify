'use server';
import { auth } from '@/auth';
import type { ContentBlock } from '@/types/tumblr';

interface ReblogParams {
  parent_tumblelog_uuid: string;
  parent_post_id: string;
  reblog_key: string;
  content?: ContentBlock[];
}

export async function reblogPost({
  parent_tumblelog_uuid,
  parent_post_id,
  reblog_key,
  content = [],
}: ReblogParams) {
  const session = await auth();
  const token = session?.access_token;

  if (!token) {
    if (session?.error === 'RefreshTokenError') {
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error('Not authenticated');
  }

  const blogIdentifier = session.user?.name;

  const res = await fetch(
    `https://api.tumblr.com/v2/blog/${blogIdentifier}/posts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        parent_tumblelog_uuid,
        parent_post_id,
        reblog_key,
      }),
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error('Failed to reblog post');
  }
  return await res.json();
}
