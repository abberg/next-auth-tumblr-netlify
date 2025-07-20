'use client';

import type { TumblrPost } from '@/types/tumblr';
import { ReblogIcon } from '../reblog-icon';

interface BlogInfoProps {
  post: TumblrPost;
}

export function BlogInfo({ post }: BlogInfoProps) {
  return (
    <div className="px-2">
      <a
        href={post.blog.url}
        className="flex items-center gap-2 font-semibold text-sky-800 hover:text-sky-950 hover:underline"
      >
        <img
          alt={`${post.blog.name} avatar`}
          src={`https://api.tumblr.com/v2/blog/${post.blog.name}.tumblr.com/avatar/30`}
          width="30"
          height="30"
        />
        <span className="min-w-0 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {post.blog.name}
        </span>
      </a>
      {post.trail && post.trail.length > 0 && (
        <a
          href={post.trail?.[0]?.blog?.url}
          className="ms-9 flex items-center gap-1 text-gray-500 text-sm leading-4 hover:text-gray-600 hover:underline"
        >
          <ReblogIcon className="size-4" />
          {post.trail?.[0]?.blog?.name}
        </a>
      )}
    </div>
  );
}
