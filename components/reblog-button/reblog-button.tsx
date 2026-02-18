'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { ReblogIcon } from '../reblog-icon';

interface ReblogButtonProps {
  onClick?: () => void;
  'aria-label'?: string;
  disabled?: boolean;
}

export function ReblogButton({
  onClick,
  'aria-label': ariaLabel = 'Reblog Post',
  disabled = false,
}: ReblogButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
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
      disabled={disabled}
      className="p-1 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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
