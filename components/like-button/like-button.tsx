'use client';

import { clsx } from 'clsx';
import { useState } from 'react';

interface LikeButtonProps {
  isLiked: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export function LikeButton({
  isLiked,
  onClick,
  'aria-label': ariaLabel,
}: LikeButtonProps) {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isStrokeAnimating, setIsStrokeAnimating] = useState(false);

  const handleClick = () => {
    if (!isLiked) {
      setIsHeartAnimating(true);
      setIsStrokeAnimating(true);
    }
    onClick?.();
  };

  const handleHeartAnimationEnd = (event: React.AnimationEvent) => {
    setIsHeartAnimating(false);
  };

  const handleStrokeAnimationEnd = (event: React.AnimationEvent) => {
    setIsStrokeAnimating(false);
  };

  // Generate aria-label if not provided
  const defaultAriaLabel = isLiked ? 'Unlike Post' : 'Like Post';
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <button
      type="button"
      aria-label={finalAriaLabel}
      onClick={handleClick}
      className="p-1"
    >
      <svg
        width="18"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="size-5 hover:cursor-pointer"
      >
        <g
          className={clsx('fill-none stroke-2 stroke-gray-400', {
            'stroke-red-500': isLiked,
            'origin-center animate-pop-heart stroke-red-500 opacity-0':
              isHeartAnimating,
          })}
          onAnimationEnd={handleHeartAnimationEnd}
        >
          <path d="M12,20l6.77-7A4.74,4.74,0,0,0,20,9.8,4.8,4.8,0,0,0,15.2,5,4.74,4.74,0,0,0,12,6.23l0,0,0,0A4.74,4.74,0,0,0,8.8,5,4.8,4.8,0,0,0,4,9.8,4.74,4.74,0,0,0,5.23,13Z" />
        </g>
        <g onAnimationEnd={handleStrokeAnimationEnd}>
          <path
            className={clsx('stroke-none', {
              'animate-pop-horizontal': isStrokeAnimating,
            })}
            d="M12 12 V0"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-horizontal': isStrokeAnimating,
            })}
            d="M12 12 V24"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-horizontal': isStrokeAnimating,
            })}
            d="M12 12 H0"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-horizontal': isStrokeAnimating,
            })}
            d="M12 12 H24"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-diagonal': isStrokeAnimating,
            })}
            d="M12 12 L0 0"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-diagonal': isStrokeAnimating,
            })}
            d="M12 12 L24 0"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-diagonal': isStrokeAnimating,
            })}
            d="M12 12 L24 24"
          />
          <path
            className={clsx('stroke-none', {
              'animate-pop-diagonal': isStrokeAnimating,
            })}
            d="M12 12 L0 24"
          />
        </g>
      </svg>
    </button>
  );
}
