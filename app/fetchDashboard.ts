'use server';

import { auth } from '@/auth';
import type { TumblrResponse } from '@/types/tumblr';

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
  if (!token) {
    throw new Error('User is not authenticated');
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    npf: 'true',
  });

  // Add since_id if provided
  if (since_id) {
    params.append('since_id', since_id);
  }

  const url = `http://api.tumblr.com/v2/user/dashboard?${params}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data: TumblrResponse = await res.json();
  return data.response.posts;
}
