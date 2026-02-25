'use client';

import * as React from 'react';

const shimmerClass =
  'animate-gradient-x rounded-sm bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';

const Skeleton = ({
  paragraph,
}: {
  paragraph?: { rows: number; width?: number };
}) => {
  const resolvedParagraph = paragraph ?? { rows: 1 };

  return (
    <div
      className="flex flex-col gap-2"
      style={{
        width: resolvedParagraph.width
          ? `${resolvedParagraph.width}px`
          : 'auto',
      }}
    >
      {Array.from(
        { length: resolvedParagraph.rows },
        (_, rowNumber) => rowNumber
      ).map((rowNumber) => (
        <div
          key={`skeleton-row-${resolvedParagraph.rows}-${rowNumber}`}
          className={`h-4 ${shimmerClass} ${
            rowNumber > 0 && rowNumber === resolvedParagraph.rows - 1
              ? 'w-2/3'
              : ''
          }`}
        />
      ))}
    </div>
  );
};

const SkeletonButton = () => {
  return <div className={`h-7 w-16 ${shimmerClass}`} />;
};

const SkeletonAvatar = () => {
  return <div className={`h-9 w-9 shrink-0 ${shimmerClass}`} />;
};

Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;

interface LoginBoxProps {
  onAuthorize?: () => void | Promise<void>;
}

export const LoginBox = ({ onAuthorize }: LoginBoxProps) => {
  const [inProp, setInProp] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setInProp(true);
  }

  React.useEffect(() => {
    const element = modalRef.current;
    if (!element || !inProp) return;

    const handleTransitionEnd = () => {
      void onAuthorize?.();
    };

    element.addEventListener('transitionend', handleTransitionEnd, {
      once: true,
    });

    return () => {
      element.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [inProp, onAuthorize]);

  return (
    <div
      className={`absolute inset-0 flex min-h-screen items-center justify-center px-4 transition-all duration-300 ease-out sm:px-0 ${
        inProp ? 'bg-[#001935]' : 'bg-white'
      } `}
    >
      <div
        className={`relative mb-6 rounded-md bg-white transition-all duration-300 ease-out ${
          inProp ? 'h-[388px] w-[300px] sm:h-[356px] sm:w-[400px]' : 'h-24 w-40'
        }`}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 transition duration-150 ease-out ${
            inProp ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={handleClick}
            className="cursor-pointer text-nowrap rounded-md bg-[#001935] px-4 py-2 font-semibold text-sm text-white hover:opacity-90"
          >
            Allow access
          </button>
        </div>

        <div
          className={`transition delay-150 duration-150 ease-in ${
            inProp ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          ref={modalRef}
        >
          <div className="px-5.25 pt-4.25 pb-5">
            <Skeleton paragraph={{ rows: 2 }} />
          </div>
          <ul className="px-6.25">
            <li className="border-[#e3e3e3] border-t border-b py-4.25">
              <Skeleton paragraph={{ rows: 1 }} />
            </li>
            <li className="border-[#e3e3e3] border-b py-4.25">
              <Skeleton paragraph={{ rows: 1 }} />
            </li>
          </ul>
          <div className="px-5.25 pt-4.25 pb-5">
            <div className="sm:hidden">
              <Skeleton paragraph={{ rows: 4 }} />
            </div>
            <div className="hidden sm:block">
              <Skeleton paragraph={{ rows: 3 }} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-[#e3e3e3] border-t p-3.75">
            <div className="flex min-w-0 items-center gap-2">
              <Skeleton.Avatar />
              <div className="min-w-0 space-y-2">
                <div className={`h-4 w-20 ${shimmerClass}`} />
                <div className={`h-4 w-16 ${shimmerClass}`} />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Skeleton.Button />
              <Skeleton.Button />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
