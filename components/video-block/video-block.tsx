'use client';
import type { VideoBlock } from '@/types/tumblr';
import clsx from 'clsx';

interface VideoBlockProps {
  block: VideoBlock;
}

export function VideoBlockComponent({ block }: VideoBlockProps) {
  console.log(block);
  // If there's embed HTML, use it directly
  if (block.embed_html) {
    return (
      <div
        className={clsx(
          'w-full overflow-hidden rounded *:h-auto *:max-w-full',
          {
            '*:aspect-video': block.provider !== 'flickr',
            '*:aspect-square': block.provider === 'flickr',
          }
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Using dangerouslySetInnerHTML for Tumblr embed content
        dangerouslySetInnerHTML={{ __html: block.embed_html }}
      />
    );
  }

  // If there's an iframe embed, use it
  if (block.embed_iframe) {
    return (
      <iframe
        src={block.embed_iframe.url}
        width={block.embed_iframe.width}
        height={block.embed_iframe.height}
        className="w-full rounded"
        allowFullScreen
        title="Video content"
      />
    );
  }

  // If there's a direct video URL, use a video element
  if (block.url) {
    return (
      <video
        src={block.url}
        controls
        className="w-full rounded"
        poster={block.poster?.url}
        preload="metadata"
      >
        <source src={block.url} type="video/mp4" />
        <track kind="captions" src={undefined} label="English" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // If there's media with a video file
  if (block.media?.url) {
    return (
      <video
        src={block.media.url}
        controls
        className="w-full rounded"
        poster={block.poster?.url}
        preload="metadata"
      >
        <source src={block.media.url} type="video/mp4" />
        <track kind="captions" src={undefined} label="English" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Fallback for unsupported video formats
  return (
    <div className="flex h-48 w-full items-center justify-center rounded bg-gray-200">
      <p className="text-gray-500">Video content not supported</p>
    </div>
  );
}
