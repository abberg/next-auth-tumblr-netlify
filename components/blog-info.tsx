'use client';

import type { TumblrPost } from '@/types/tumblr';

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
        {post.blog.name}
      </a>
      {post.trail && post.trail.length > 0 && (
        <a
          href={post.trail?.[0]?.blog?.url}
          className="ms-9 flex items-center gap-1 text-gray-400 text-sm leading-3.5 hover:text-gray-600 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <title>Reblogged</title>
            <path
              fillRule="evenodd"
              d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
              clipRule="evenodd"
            />
          </svg>
          {post.trail?.[0]?.blog?.name}
        </a>
      )}
    </div>
  );
}
