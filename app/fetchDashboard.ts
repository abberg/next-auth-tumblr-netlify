'use server';

import { TumblrApiError, tumblrRequest } from '@/app/tumblrClient';
import { auth } from '@/auth';
import type { TumblrResponse } from '@/types/tumblr';
import { redirect } from 'next/navigation';

interface FetchDashboardParams {
  offset?: number;
  limit?: number;
  since_id?: string;
  before_id?: string;
}

export async function fetchDashboard({
  offset = 0,
  limit = 18,
  since_id,
  before_id,
}: FetchDashboardParams) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    throw new Error('Dashboard limit must be between 1 and 20.');
  }
  if (before_id && (!/^\d+$/.test(before_id) || since_id || offset !== 0)) {
    throw new Error(
      'An older-post cursor cannot be combined with an offset or newer-post cursor.'
    );
  }
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
    ...(before_id ? { before_id } : { offset: offset.toString() }),
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
