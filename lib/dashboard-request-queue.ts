'use client';

import { fetchDashboard } from '@/app/fetchDashboard';

// Shared by every dashboard consumer in this tab. Queue the server action itself,
// so requests cannot overlap even when handled by different server instances.
let tail: Promise<void> = Promise.resolve();

export function fetchDashboardQueued(
  params: Parameters<typeof fetchDashboard>[0]
): ReturnType<typeof fetchDashboard> {
  const request = tail.then(() => fetchDashboard(params));
  // Preserve each caller's rejection, but keep a failure from blocking the queue.
  tail = request.then(
    () => undefined,
    () => undefined
  );
  return request;
}
