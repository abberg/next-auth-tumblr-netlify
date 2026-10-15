import { auth } from '@/auth';
import { DashboardFeed } from '@/components/dashboard-feed';
import { ScrollToTop } from '@/components/scroll-to-top';
import type { TumblrPost } from '@/types/tumblr';
import { redirect } from 'next/navigation';
import { fetchDashboard } from './fetchDashboard';
import { ServerTumblrActions } from './tumblr-actions';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const initialPosts: TumblrPost[] = await fetchDashboard({});

  return (
    <>
      <ServerTumblrActions>
        <DashboardFeed
          key={session.user?.id ?? session.user?.name}
          initialPosts={initialPosts}
          accountId={session.user?.id ?? session.user?.name ?? undefined}
        />
      </ServerTumblrActions>
      <ScrollToTop />
    </>
  );
}
