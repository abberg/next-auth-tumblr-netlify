import type React from 'react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ScrollShadowBoxProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  shadowHeight?: number; // px, default 16
  maxHeight?: string;
}

/**
 * A scrollable container that shows a shadow at the top and/or bottom when content overflows.
 * Shadows are shown only when there is more content to scroll in that direction.
 */
export function ScrollShadowBox({
  children,
  className = '',
  style = {},
  shadowHeight = 8,
  maxHeight = '100%',
}: ScrollShadowBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  // Check scroll position and update shadow visibility
  const checkShadows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowTop(scrollTop > 0);
    setShowBottom(scrollTop + clientHeight < scrollHeight - 1); // -1 for float rounding
  }, []);

  useEffect(() => {
    checkShadows();
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', checkShadows);
    // Re-check on resize/content change
    const resizeObserver = new window.ResizeObserver(checkShadows);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener('scroll', checkShadows);
      resizeObserver.disconnect();
    };
  }, [checkShadows]);

  // Re-check when checkShadows changes (should only run on mount)
  useEffect(() => {
    checkShadows();
  }, [checkShadows]);

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Top shadow */}
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 z-10 border-t border-t-sky-800/10 bg-sky-800/5 transition-opacity duration-300"
        style={{
          height: shadowHeight,
          opacity: showTop ? 1 : 0,
        }}
        aria-hidden="true"
      />
      {/* Bottom shadow */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 border-b border-b-sky-800/10 bg-sky-800/5 transition-opacity duration-300"
        style={{
          height: shadowHeight,
          opacity: showBottom ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className="min-h-0 overflow-y-auto px-2"
        style={{ maxHeight: maxHeight }}
      >
        {children}
      </div>
    </div>
  );
}
