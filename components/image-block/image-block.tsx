'use client';
import type { ImageBlock, MediaObject } from '@/types/tumblr';

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

interface ImageBlockProps {
  block: ImageBlock;
}

export function ImageBlockComponent({ block }: ImageBlockProps) {
  const imageUrl = getOptimalImageUrl(block.media);

  if (!imageUrl) {
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt={block.alt_text ?? ''}
      className="h-auto w-full rounded"
    />
  );
}
