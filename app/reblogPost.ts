'use server';
import { auth } from '@/auth';
import type { ContentBlock } from '@/types/tumblr';
import { tumblrRequest } from './tumblrClient';

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
  const queueKey = session?.user?.id ?? session?.user?.name ?? 'anonymous';
  if (session?.error === 'RefreshTokenError')
    throw new Error('Not authenticated');
  if (session?.error === 'TemporaryRefreshError') {
    throw new Error('Temporary authentication issue. Please retry shortly.');
  }
  if (!token) throw new Error('Not authenticated');
  const blogIdentifier = session.user?.name;
  if (!blogIdentifier) throw new Error('Missing blog identifier');

  return tumblrRequest({
    token,
    method: 'POST',
    path: `/blog/${blogIdentifier}/posts`,
    body: {
      content,
      parent_tumblelog_uuid,
      parent_post_id,
      reblog_key,
    },
    queueKey,
  });
}
