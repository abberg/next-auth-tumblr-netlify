import type { AudioBlock } from '@/types/tumblr';
import { clsx } from 'clsx';
import type React from 'react';

interface AudioBlockComponentProps {
  block: AudioBlock;
}

export function AudioBlockComponent({ block }: AudioBlockComponentProps) {
  // If embed_html is present, render only the embed and skip poster/metadata
  if (block.embed_html) {
    return (
      <div
        className={clsx({
          '*:h-[352px] *:max-w-fit': block.provider === 'spotify',
          '*:aspect-square *:h-auto *:max-w-full':
            block.provider === 'soundcloud',
          '*:max-w-full': block.provider === 'tumblr',
        })}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted embed from Tumblr API
        dangerouslySetInnerHTML={{ __html: block.embed_html }}
      />
    );
  }

  // Poster image (first in array if present)
  const posterUrl = block.poster?.[0]?.url;

  // Waterfall rendering logic
  let mainContent: React.ReactNode = null;
  if (block.media?.url) {
    // Native audio
    mainContent = (
      <audio
        controls
        src={block.media.url}
        className="w-full"
        preload="metadata"
      >
        <source src={block.media.url} type={block.media.type || 'audio/mpeg'} />
        <track kind="captions" src={undefined} label="English" />
        Your browser does not support the audio element.
      </audio>
    );
  } else if (block.embed_url) {
    // Embedded iframe
    mainContent = (
      <iframe
        src={block.embed_url}
        className="w-full rounded"
        allow="autoplay"
        title={block.title || 'Audio embed'}
        height={120}
      />
    );
  } else if (block.url) {
    // Fallback: link
    mainContent = (
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-800 underline hover:text-sky-950"
      >
        Listen to audio
      </a>
    );
  }

  return (
    <div className="flex items-start gap-4">
      {/* Poster (square) */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={block.title ? `${block.title} album art` : 'Audio poster'}
          className="aspect-square h-24 w-24 rounded border border-gray-200 bg-gray-100 object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded border border-gray-200 bg-gray-100 text-gray-400 text-xs">
          No Art
        </div>
      )}
      {/* Controls and metadata */}
      <div className="min-w-0 flex-1">
        {/* Controls */}
        <div>{mainContent}</div>
        {/* Metadata */}
        <div className="mt-2 text-gray-700 text-sm">
          {block.title && (
            <div className="truncate font-semibold">{block.title}</div>
          )}
          {(block.artist || block.album) && (
            <div className="truncate">
              {block.artist && <span className="mr-2">{block.artist}</span>}
              {block.album && (
                <span className="text-gray-500">({block.album})</span>
              )}
            </div>
          )}
          {block.provider && (
            <div className="text-gray-400 text-xs">{block.provider}</div>
          )}
        </div>
      </div>
    </div>
  );
}
