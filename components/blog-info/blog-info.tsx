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
        <span className="min-w-0 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {post.blog.name}
        </span>
      </a>
      {post.trail && post.trail.length > 0 && (
        <a
          href={post.trail?.[0]?.blog?.url}
          className="ms-9 flex items-center gap-1 text-gray-500 text-sm leading-4 hover:text-gray-600 hover:underline"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-[1lh] fill-none stroke-2 stroke-gray-500"
          >
            <g>
              <path
                className="[stroke-dasharray:18_39] [stroke-dashoffset:-4]"
                d="M19 6 Q21 6 21 8 L21 16 Q21 18 19 18 L5 18 Q3 18 3 16 L3 8 Q3 6 5 6 Z"
              />
              <polyline
                className="absolute [offset-path:path('M19_6_Q21_6_21_8_L21_16_Q21_18_19_18_L5_18_Q3_18_3_16_L3_8_Q3_6_5_6_Z')]"
                points="-3 -3 0 0 -3 3"
              />
              <path
                className="[stroke-dasharray:18_39] [stroke-dashoffset:-4]"
                d="M6 18 Q4 18 4 16 L4 8 Q4 6 6 6 L18 6 Q20 6 20 8 L20 16 Q20 18 18 18 Z"
              />
              <polyline
                className="absolute [offset-path:path('M6_18_Q4_18_4_16_L4_8_Q4_6_6_6_L18_6_Q20_6_20_8_L20_16_Q20_18_18_18_Z')]"
                points="-3 -3 0 0 -3 3"
              />
            </g>
          </svg>
          {post.trail?.[0]?.blog?.name}
        </a>
      )}
    </div>
  );
}
