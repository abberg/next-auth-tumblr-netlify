import { clsx } from 'clsx';
import type React from 'react';

interface ReblogIconProps {
  className?: string;
  isAnimating?: boolean;
  onAnimationEnd?: (event: React.AnimationEvent<SVGGElement>) => void;
}

export function ReblogIcon({
  className,
  isAnimating = false,
  onAnimationEnd,
}: ReblogIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={clsx('fill-none stroke-2 stroke-current', className)}
    >
      <g onAnimationEnd={onAnimationEnd}>
        <path
          className={clsx('[stroke-dasharray:18_39] [stroke-dashoffset:-4]', {
            'animate-dash': isAnimating,
          })}
          d="M19 6 Q21 6 21 8 L21 16 Q21 18 19 18 L5 18 Q3 18 3 16 L3 8 Q3 6 5 6 Z"
        />
        <polyline
          className={clsx(
            "absolute [offset-path:path('M19_6_Q21_6_21_8_L21_16_Q21_18_19_18_L5_18_Q3_18_3_16_L3_8_Q3_6_5_6_Z')]",
            {
              'animate-arrow': isAnimating,
            }
          )}
          points="-3 -3 0 0 -3 3"
        />
        <path
          className={clsx('[stroke-dasharray:18_39] [stroke-dashoffset:-4]', {
            'animate-dash': isAnimating,
          })}
          d="M6 18 Q4 18 4 16 L4 8 Q4 6 6 6 L18 6 Q20 6 20 8 L20 16 Q20 18 18 18 Z"
        />
        <polyline
          className={clsx(
            "absolute [offset-path:path('M6_18_Q4_18_4_16_L4_8_Q4_6_6_6_L18_6_Q20_6_20_8_L20_16_Q20_18_18_18_Z')]",
            {
              'animate-arrow': isAnimating,
            }
          )}
          points="-3 -3 0 0 -3 3"
        />
      </g>
    </svg>
  );
}
