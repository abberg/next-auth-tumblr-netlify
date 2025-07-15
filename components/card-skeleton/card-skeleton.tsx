import type { ComponentProps } from 'react';

const ImageAlt = (props: ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>Image Alt</title>
    <g fill="currentColor">
      <path d="M18.435 3.06H5.565a2.5 2.5 0 0 0-2.5 2.5v12.88a2.507 2.507 0 0 0 2.5 2.5h12.87a2.507 2.507 0 0 0 2.5-2.5V5.56a2.5 2.5 0 0 0-2.5-2.5Zm-14.37 2.5a1.5 1.5 0 0 1 1.5-1.5h12.87a1.5 1.5 0 0 1 1.5 1.5v8.66l-3.88-3.88a1.509 1.509 0 0 0-2.12 0l-4.56 4.57a.513.513 0 0 1-.71 0l-.56-.56a1.522 1.522 0 0 0-2.12 0l-1.92 1.92Zm15.87 12.88a1.5 1.5 0 0 1-1.5 1.5H5.565a1.5 1.5 0 0 1-1.5-1.5v-.75L6.7 15.06a.5.5 0 0 1 .35-.14.524.524 0 0 1 .36.14l.55.56a1.509 1.509 0 0 0 2.12 0l4.57-4.57a.5.5 0 0 1 .71 0l4.58 4.58Z" />
      <path d="M8.062 10.565a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5Zm0-4a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5Z" />
    </g>
  </svg>
);

const Shine = ({
  children,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`animate-gradient-x bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
);

export const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Shine className="flex aspect-5/6 items-center justify-center rounded-sm">
        <ImageAlt className="h-auto w-16 text-gray-300" aria-hidden={true} />
      </Shine>
      <div className="mx-2 flex items-center gap-4">
        <Shine className="h-7.5 w-7.5" />
        <Shine className="h-4 flex-1 rounded-sm" />
      </div>
      <div className="flex items-center justify-between">
        <Shine className="h-3 w-12 rounded-sm" />
        <div className="flex gap-1">
          <Shine className="h-7 w-7 rounded-md" />
          <Shine className="h-7 w-7 rounded-md" />
        </div>
      </div>
    </div>
  );
};
