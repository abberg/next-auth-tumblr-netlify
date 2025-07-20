'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { ReblogIcon } from '../reblog-icon';

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
      <ReblogIcon
        className={clsx(
          'size-5',
          isAnimating ? 'stroke-green-600' : 'stroke-gray-500'
        )}
        isAnimating={isAnimating}
        onAnimationEnd={handleArrowAnimationEnd}
      />
    </button>
  );
}
