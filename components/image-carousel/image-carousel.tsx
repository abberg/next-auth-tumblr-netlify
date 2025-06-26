'use client';

import { ImageBlockComponent } from '@/components/image-block';
import type { ImageBlock } from '@/types/tumblr';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

interface ImageCarouselProps {
  imageBlocks: ImageBlock[];
}

export function ImageCarousel({ imageBlocks }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollNext]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <button
        className="flex w-full border-0 bg-transparent p-0"
        onClick={scrollNext}
        type="button"
      >
        {imageBlocks.map((block) => (
          <div
            key={block.media[0].media_key || block.media[0].url}
            className="min-w-0 flex-[0_0_100%]"
          >
            <ImageBlockComponent block={block} />
          </div>
        ))}
      </button>

      {/* Dots indicator */}
      {imageBlocks.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {imageBlocks.map((block, index) => (
            <button
              key={`dot-${block.media[0].media_key || block.media[0].url}`}
              type="button"
              className={`h-2 w-2 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
