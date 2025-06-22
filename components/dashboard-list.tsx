'use client';
import type { TumblrPost } from '@/types/tumblr';
import { Post } from './post';

interface DashboardListProps {
  posts?: TumblrPost[];
}

export function DashboardList({ posts }: DashboardListProps) {
  if (!posts?.length) {
    return <p>No posts to display</p>;
  }

  return (
    <ul className="my-6 ms-0 grid list-none grid-cols-3 gap-8">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}
