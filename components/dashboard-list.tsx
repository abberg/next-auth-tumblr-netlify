'use client';
import type {
  ContentBlock,
  ImageBlock,
  MediaObject,
  TumblrPost,
} from '@/types/tumblr';
import { JSONTree } from 'react-json-tree';

const theme = {
  scheme: 'Tokyonight',
  author: 'Folke Lemaitre (https://github.com/folke)',
  base00: '#24283b',
  base01: '#1f2335',
  base02: '#292e42',
  base03: '#565f89',
  base04: '#a9b1d6',
  base05: '#c0caf5',
  base06: '#c0caf5',
  base07: '#c0caf5',
  base08: '#f7768e',
  base09: '#ff9e64',
  base0A: '#e0af68',
  base0B: '#9ece6a',
  base0C: '#1abc9c',
  base0D: '#41a6b5',
  base0E: '#bb9af7',
  base0F: '#ff007c',
};

const getOptimalImageUrl = (media: MediaObject[]): string | null => {
  if (!media?.length) return null;

  // Sort media by width to find closest to 640px
  const sorted = [...media].sort((a, b) => {
    const aDiff = Math.abs(640 - (a.width ?? 0));
    const bDiff = Math.abs(640 - (b.width ?? 0));
    return aDiff - bDiff;
  });

  return sorted[0]?.url ?? null;
};

const isImageBlock = (block: ContentBlock): block is ImageBlock => {
  return block.type === 'image';
};

interface DashboardListProps {
  posts?: TumblrPost[];
}

export function DashboardList({ posts }: DashboardListProps) {
  if (!posts?.length) {
    return <p>No posts to display</p>;
  }

  return (
    <>
      <ul className="ms-0 mb-4 grid list-none grid-cols-3 gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            {/* display content if it's an image */}
            {post.content.map((block) => {
              if (isImageBlock(block)) {
                const imageUrl = getOptimalImageUrl(block.media);
                return imageUrl ? (
                  <img
                    key={block.media[0].media_key}
                    src={imageUrl}
                    alt={block.alt_text ?? ''}
                    className="h-auto w-full rounded"
                  />
                ) : null;
              }
              return null;
            })}
            {/* for each item in the trail display its content */}
            {post.trail?.map((trailItem, trailIndex) => (
              <div key={`trail-${post.id}-${trailIndex}`}>
                {trailItem.content?.map((block, blockIndex) => {
                  if (isImageBlock(block)) {
                    const imageUrl = getOptimalImageUrl(block.media);
                    return imageUrl ? (
                      <img
                        key={`trail-${post.id}-${trailIndex}-${blockIndex}`}
                        src={imageUrl}
                        alt={block.alt_text ?? ''}
                        className="h-auto w-full rounded"
                      />
                    ) : null;
                  }
                  return null;
                })}
                {trailItem.blog && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      alt={trailItem.blog.name}
                      src={`https://api.tumblr.com/v2/blog/${trailItem.blog.name}.tumblr.com/avatar/30`}
                      width="30"
                      height="30"
                    />
                    <a
                      href={trailItem.blog.url}
                      className="font-bold text-blue-500 text-sm hover:text-blue-700 hover:underline"
                    >
                      {trailItem.blog.name}
                    </a>
                  </div>
                )}
              </div>
            ))}

            {/* display blog name and avatar */}
            <div className="flex items-center gap-2">
              <img
                alt={post.blog.name}
                src={`https://api.tumblr.com/v2/blog/${post.blog.name}.tumblr.com/avatar/30`}
                width="30"
                height="30"
              />
              <a
                href={post.blog.url}
                className="font-bold text-blue-500 text-sm hover:text-blue-700 hover:underline"
              >
                {post.blog.name}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded bg-[rgb(36,40,59)] px-3 pt-0.5 pb-2 font-mono font-normal text-sm">
        <JSONTree data={posts} theme={theme} />
      </div>
    </>
  );
}
