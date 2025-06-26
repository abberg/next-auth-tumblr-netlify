import type { LinkBlock } from '@/types/tumblr';

interface LinkBlockComponentProps {
  block: LinkBlock;
}

export function LinkBlockComponent({ block }: LinkBlockComponentProps) {
  // Poster image (first in array if present)
  const posterArray = Array.isArray(block.poster) ? block.poster : [];
  const posterUrl = posterArray[0]?.url;

  return (
    <div className="flex items-start gap-2">
      {/* Poster (24x24) */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={block.title ? `${block.title} thumbnail` : 'Link poster'}
          className="h-24 w-24 flex-shrink-0 rounded border border-gray-200 bg-gray-100 object-cover"
        />
      ) : null}
      {/* Link content */}
      <div className="min-w-0 flex-1">
        {/* Title as clickable link */}
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-semibold text-sky-800 hover:text-sky-950"
        >
          {block.title || block.url}
        </a>
        {/* Description */}
        {block.description && (
          <div className="truncate text-gray-700 text-sm">
            {block.description}
          </div>
        )}
        {/* Meta row */}
        {(block.author || block.site_name || block.display_url) && (
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-gray-400 text-xs">
            {block.author && <span>{block.author}</span>}
            {block.site_name && <span>{block.site_name}</span>}
            {block.display_url && <span>{block.display_url}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
