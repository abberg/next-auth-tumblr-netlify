'use client';
import { Post } from '@/components/post';
import type { TumblrPost } from '@/types/tumblr';

interface DashboardListProps {
  posts?: TumblrPost[];
}

export function DashboardList({ posts }: DashboardListProps) {
  if (!posts?.length) {
    return <p>No posts to display</p>;
  }

  return (
    <ul className="my-6 ms-0 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}
