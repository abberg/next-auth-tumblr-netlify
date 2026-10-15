import { TumblrActionsProvider } from '@/components/tumblr-actions';
import { fetchDashboardQueued } from '@/lib/dashboard-request-queue';
import { vi } from 'vitest';

// Uses the real per-tab request queue; mock '@/app/fetchDashboard' to control
// what each dashboard request returns.
export function TestTumblrActions({ children }: { children: React.ReactNode }) {
  return (
    <TumblrActionsProvider
      actions={{
        fetchDashboard: fetchDashboardQueued,
        likePost: vi.fn(),
        unlikePost: vi.fn(),
        reblogPost: vi.fn(),
      }}
    >
      {children}
    </TumblrActionsProvider>
  );
}
