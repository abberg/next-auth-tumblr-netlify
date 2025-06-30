import { DashboardFeed } from '@/components/dashboard-feed';
import { ScrollToTop } from '@/components/scroll-to-top';
import type { TumblrPost } from '@/types/tumblr';
import { Suspense, use } from 'react';
import { fetchDashboard } from './fetchDashboard';

export default function Home() {
  const initialPosts: TumblrPost[] = use(fetchDashboard({}));

  return (
    <div className="mx-auto min-h-screen max-w-5xl">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardFeed initialPosts={initialPosts} />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}
