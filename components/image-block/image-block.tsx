'use client';
import type { ImageBlock, MediaObject } from '@/types/tumblr';
import { useCallback, useEffect, useRef, useState } from 'react';

const getOptimalImageUrl = (
  media: MediaObject[]
): {
  imageUrl: string;
  imageWidth: number | undefined;
  imageHeight: number | undefined;
} | null => {
  if (!media?.length) return null;

  // Sort media by width to find closest to 640px
  const sorted = [...media].sort((a, b) => {
    const aDiff = Math.abs(640 - (a.width ?? 0));
    const bDiff = Math.abs(640 - (b.width ?? 0));
    return aDiff - bDiff;
  });
  const img = sorted[0];
  if (!img) return null;

  return { imageUrl: img.url, imageWidth: img.width, imageHeight: img.height };
};

interface ImageBlockProps {
  block: ImageBlock;
}

export function ImageBlockComponent({ block }: ImageBlockProps) {
  const imageData = getOptimalImageUrl(block.media);

  if (!imageData || !imageData.imageUrl) {
    return null;
  }

  // Create a unique key for this image based on its URL
  const storageKey = `image-hidden-${imageData.imageUrl}`;

  const [isHidden, setIsHidden] = useState(false);
  const [hasPixelated, setHasPixelated] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createPixelatedImage = useCallback(() => {
    if (hasPixelated) return; // Already pixelated

    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    const size = 0.02;
    const w = canvas.width * size;
    const h = canvas.height * size;

    ctx.drawImage(img, 0, 0, w, h);
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    setHasPixelated(true);
  }, [hasPixelated]);

  // Check localStorage immediately on mount
  useEffect(() => {
    const savedHidden = localStorage.getItem(storageKey);
    if (savedHidden === 'true') {
      setIsHidden(true);
      // Check if image is already loaded (cached case)
      const img = imageRef.current;
      if (img?.complete) {
        createPixelatedImage();
      }
    }
  }, [storageKey, createPixelatedImage]);

  const { imageUrl, imageWidth, imageHeight } = imageData;

  const handleToggleHidden = () => {
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState);

    // Save to localStorage
    localStorage.setItem(storageKey, newHiddenState.toString());

    if (newHiddenState) {
      createPixelatedImage();
    }
  };

  const handleOnLoad = () => {
    // If image should be hidden, pixelate it now that it's loaded
    if (isHidden) {
      createPixelatedImage();
    }
  };

  return (
    <div className="group relative">
      <img
        ref={imageRef}
        src={imageUrl}
        alt={block.alt_text ?? ''}
        className={`relative z-10 h-auto w-full rounded bg-gray-300 transition-opacity duration-200 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        width={imageWidth}
        height={imageHeight}
        onLoad={handleOnLoad}
      />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 h-auto w-full rounded transition-opacity duration-200 ${
          isHidden ? 'opacity-100' : 'opacity-0'
        }`}
        width={imageWidth}
        height={imageHeight}
      />

      <button
        type="button"
        onClick={handleToggleHidden}
        className="absolute top-2 right-2 z-20 rounded bg-black/50 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 hover:opacity-100"
        aria-label={isHidden ? 'Show image' : 'Hide image'}
      >
        {isHidden ? 'Show' : 'Hide'}
      </button>
    </div>
  );
}
