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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
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
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {imageBlocks.map((block, index) => (
            <div
              key={`${block.media[0].media_key || block.media[0].url}-${index}`}
              className="min-w-0 flex-[0_0_100%]"
            >
              <ImageBlockComponent block={block} />
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        {imageBlocks.length > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            {imageBlocks.map((block, index) => (
              <button
                key={`dot-${block.media[0].media_key || block.media[0].url}-${index}`}
                type="button"
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Scroll to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="-translate-y-1/2 absolute top-1/2 left-0 z-10 rounded-r-sm bg-black/60 px-4 py-8 text-white opacity-0 hover:opacity-100"
        onClick={scrollPrev}
        aria-label="Previous image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          aria-hidden={true}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        type="button"
        className="-translate-y-1/2 after:-top-1/2 after:-bottom-1/2 absolute top-1/2 right-0 z-10 rounded-l-sm bg-black/60 px-4 py-8 text-white opacity-0 after:absolute after:right-0 after:left-0 after:bg-transparent after:opacity-20 hover:opacity-100"
        onClick={scrollNext}
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
