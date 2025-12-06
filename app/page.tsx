import { auth } from '@/auth';
import { DashboardFeed } from '@/components/dashboard-feed';
import { NewPostsNotification } from '@/components/new-posts-notification/new-posts-notification';
import { ScrollToTop } from '@/components/scroll-to-top';
import type { TumblrPost } from '@/types/tumblr';
import { redirect } from 'next/navigation';
import { fetchDashboard } from './fetchDashboard';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const initialPosts: TumblrPost[] = await fetchDashboard({});

  return (
    <>
      <NewPostsNotification firstPostId={initialPosts[0].id_string} />
      <DashboardFeed initialPosts={initialPosts} />
      <ScrollToTop />
    </>
  );
}
