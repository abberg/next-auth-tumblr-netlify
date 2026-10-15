'use client';

import { DashboardList } from '@/components/dashboard-list';
import { NewPostsNotification } from '@/components/new-posts-notification/new-posts-notification';
import { useTumblrActions } from '@/components/tumblr-actions';
import type { TumblrPost } from '@/types/tumblr';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_POSTS,
  PAGE_SIZE,
  type ReadingPosition,
  appendBatch,
  createFeedSession,
  parseSavedSession,
} from './feed-session';

interface DashboardFeedProps {
  initialPosts: TumblrPost[];
  accountId?: string;
}

export function DashboardFeed({ initialPosts, accountId }: DashboardFeedProps) {
  const { fetchDashboard } = useTumblrActions();
  const [session, setSession] = useState(() => createFeedSession(initialPosts));
  const [ready, setReady] = useState(false);
  const [restorePosition, setRestorePosition] =
    useState<ReadingPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveFailed, setSaveFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const sessionRef = useRef(session);
  const positionRef = useRef<ReadingPosition | null>(null);
  const storageKey = accountId ? `dashboard-reading:v1:${accountId}` : null;

  useEffect(() => {
    mounted.current = true;
    if (storageKey) {
      try {
        const saved = parseSavedSession(sessionStorage.getItem(storageKey));
        if (saved) {
          sessionRef.current = saved.session;
          positionRef.current = saved.position;
          setSession(saved.session);
          setRestorePosition(saved.position);
        }
      } catch {
        setSaveFailed(true);
      }
    }
    setReady(true);
    return () => {
      mounted.current = false;
    };
  }, [storageKey]);

  // Restore an actual post, allowing media above it to settle. Stop immediately
  // when the reader scrolls or presses a key, so restoration cannot fight them.
  useEffect(() => {
    if (!ready || !restorePosition || !rootRef.current) return;
    const root = rootRef.current;
    let stopped = false;
    const restore = () => {
      if (stopped) return;
      const post = Array.from(
        root.querySelectorAll<HTMLElement>('[data-post-id]')
      ).find((node) => node.dataset.postId === restorePosition.postId);
      if (post)
        window.scrollBy({
          top: post.getBoundingClientRect().top - restorePosition.top,
          behavior: 'instant',
        });
    };
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(restore)
        : null;
    observer?.observe(root);
    const stop = () => {
      stopped = true;
      observer?.disconnect();
      setRestorePosition(null);
    };
    const frame = requestAnimationFrame(restore);
    const timer = window.setTimeout(stop, 3000);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('pointerdown', stop);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
    };
  }, [ready, restorePosition]);

  useEffect(() => {
    if (!ready || !storageKey) return;
    sessionRef.current = session;
    const save = () => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            session: sessionRef.current,
            position: positionRef.current,
          })
        );
      } catch {
        if (mounted.current) setSaveFailed(true);
      }
    };
    const capture = () => {
      if (!restorePosition) {
        const post = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>('[data-post-id]') ?? []
        ).find((node) => {
          const rect = node.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        });
        if (post?.dataset.postId)
          positionRef.current = {
            postId: post.dataset.postId,
            top: post.getBoundingClientRect().top,
          };
      }
      save();
    };
    let timer: number | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = window.setTimeout(capture, 150);
    };
    save();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', capture);
    document.addEventListener('visibilitychange', capture);
    return () => {
      clearTimeout(timer);
      capture();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', capture);
      document.removeEventListener('visibilitychange', capture);
    };
  }, [ready, session, storageKey, restorePosition]);

  const loadMore = useCallback(async () => {
    if (!ready || inFlight.current || session.end || !session.cursor) return;
    inFlight.current = true;
    setLoading(true);
    setError('');
    try {
      const limit = Math.min(PAGE_SIZE, MAX_POSTS - session.consumed);
      const posts = await fetchDashboard({
        before_id: session.cursor,
        limit,
      });
      if (mounted.current) setSession(appendBatch(session, posts, limit));
    } catch (error) {
      if (mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not load older posts. Please retry.'
        );
    } finally {
      inFlight.current = false;
      if (mounted.current) setLoading(false);
    }
  }, [fetchDashboard, ready, session]);

  const showLatest = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError('');
    try {
      const posts = await fetchDashboard({ limit: PAGE_SIZE });
      if (!mounted.current) return;
      setRestorePosition(null);
      positionRef.current = null;
      setSession(createFeedSession(posts));
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      if (mounted.current)
        setError(
          'Could not load the latest posts. Your reading session has been kept. Try the new-post notification again.'
        );
    } finally {
      inFlight.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    const loader = loaderRef.current;
    if (!ready || !loader || error || loading || restorePosition || session.end)
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loader);
    return () => observer.disconnect();
  }, [ready, error, loading, restorePosition, session.end, loadMore]);

  const posts = session.batches.flat();
  return (
    <div ref={rootRef}>
      {ready && (
        <NewPostsNotification
          key={session.startedAt}
          firstPostId={posts[0]?.id_string}
          onRefresh={() => void showLatest()}
          refreshing={loading}
        />
      )}
      {saveFailed && (
        <p role="alert">
          This tab could not save your reading session. Keep it open to retain
          your place.
        </p>
      )}
      <DashboardList posts={posts} />
      {error && (
        <p role="alert" className="my-4 text-center">
          {error}
        </p>
      )}
      {!session.end && (
        <div ref={loaderRef} className="py-6 text-center">
          <button
            type="button"
            className="rounded border px-4 py-2 disabled:opacity-50"
            disabled={!ready || loading}
            onClick={() => void loadMore()}
          >
            {loading
              ? 'Loading…'
              : error
                ? 'Retry older posts'
                : 'Load older posts'}
          </button>
        </div>
      )}
      {session.end && (
        <p className="py-6 text-center">
          {session.end === 'window'
            ? 'You’ve reached the end of the available dashboard window.'
            : 'No older posts are available in this dashboard window.'}
        </p>
      )}
    </div>
  );
}
