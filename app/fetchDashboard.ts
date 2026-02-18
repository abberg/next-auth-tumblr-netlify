'use server';

import { TumblrApiError, tumblrRequest } from '@/app/tumblrClient';
import { auth } from '@/auth';
import type { TumblrResponse } from '@/types/tumblr';
import { redirect } from 'next/navigation';

interface FetchDashboardParams {
  offset?: number;
  limit?: number;
  since_id?: string;
}

export async function fetchDashboard({
  offset = 0,
  limit = 18,
  since_id,
}: FetchDashboardParams) {
  const session = await auth();
  const token = session?.access_token;
  const queueKey = session?.user?.id ?? session?.user?.name ?? 'anonymous';

  if (!token || session?.error === 'RefreshTokenError') {
    redirect('/login');
  }
  if (session?.error === 'TemporaryRefreshError') {
    throw new Error('Temporary authentication issue. Please retry shortly.');
  }
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
    npf: 'true',
  };
  if (since_id) {
    params.since_id = since_id;
  }

  try {
    const data = await tumblrRequest<TumblrResponse>({
      token,
      path: '/user/dashboard',
      params,
      queueKey,
    });
    return data.response.posts;
  } catch (error) {
    if (error instanceof TumblrApiError && error.isAuthError) {
      redirect('/login');
    }
    throw error;
  }
}
