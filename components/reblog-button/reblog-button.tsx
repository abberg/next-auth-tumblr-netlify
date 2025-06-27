'use client';

import { clsx } from 'clsx';
import { useState } from 'react';

interface ReblogButtonProps {
  onClick?: () => void;
  'aria-label'?: string;
}

export function ReblogButton({
  onClick,
  'aria-label': ariaLabel = 'Reblog Post',
}: ReblogButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick?.();
  };

  const handleArrowAnimationEnd = (event: React.AnimationEvent) => {
    setIsAnimating(false);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className="p-1 hover:cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="size-5 fill-none stroke-2 stroke-gray-400"
      >
        <g onAnimationEnd={handleArrowAnimationEnd}>
          <path
            className={clsx('[stroke-dasharray:18_39] [stroke-dashoffset:-4]', {
              'animate-dash stroke-green-600': isAnimating,
            })}
            d="M19 6 Q21 6 21 8 L21 16 Q21 18 19 18 L5 18 Q3 18 3 16 L3 8 Q3 6 5 6 Z"
          />
          <polyline
            className={clsx(
              "absolute [offset-path:path('M19_6_Q21_6_21_8_L21_16_Q21_18_19_18_L5_18_Q3_18_3_16_L3_8_Q3_6_5_6_Z')]",
              {
                'animate-arrow stroke-green-600': isAnimating,
              }
            )}
            points="-3 -3 0 0 -3 3"
          />
          <path
            className={clsx('[stroke-dasharray:18_39] [stroke-dashoffset:-4]', {
              'animate-dash stroke-green-600': isAnimating,
            })}
            d="M6 18 Q4 18 4 16 L4 8 Q4 6 6 6 L18 6 Q20 6 20 8 L20 16 Q20 18 18 18 Z"
          />
          <polyline
            className={clsx(
              "absolute [offset-path:path('M6_18_Q4_18_4_16_L4_8_Q4_6_6_6_L18_6_Q20_6_20_8_L20_16_Q20_18_18_18_Z')]",
              {
                'animate-arrow stroke-green-600': isAnimating,
              }
            )}
            points="-3 -3 0 0 -3 3"
          />
        </g>
      </svg>
    </button>
  );
}
