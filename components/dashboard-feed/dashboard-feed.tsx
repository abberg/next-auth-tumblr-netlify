'use client';

import { fetchDashboard } from '@/app/fetchDashboard';
import { DashboardList } from '@/components/dashboard-list';
import type { TumblrPost } from '@/types/tumblr';
import { useCallback, useEffect, useRef, useState } from 'react';

interface DashboardFeedProps {
  initialPosts: TumblrPost[];
}

const PAGE_SIZE = 18;
const MAX_OFFSET = 268;

export function DashboardFeed({ initialPosts }: DashboardFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [offset, setOffset] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const requestInFlightRef = useRef(false);
  const offsetRef = useRef(initialPosts.length);

  const loadMore = useCallback(async () => {
    if (requestInFlightRef.current || !hasMore) return;
    requestInFlightRef.current = true;
    setLoading(true);

    const currentOffset = offsetRef.current;
    try {
      const newPosts = await fetchDashboard({
        offset: currentOffset,
        limit: PAGE_SIZE,
      });

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const uniqueNewPosts = newPosts.filter(
          (post) => !existingIds.has(post.id)
        );
        return [...prev, ...uniqueNewPosts];
      });

      if (
        currentOffset + newPosts.length > MAX_OFFSET ||
        newPosts.length < PAGE_SIZE
      ) {
        setHasMore(false);
      } else {
        const nextOffset = currentOffset + newPosts.length;
        offsetRef.current = nextOffset;
        setOffset(nextOffset);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !requestInFlightRef.current &&
          !loading
        ) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observerRef.current.observe(currentLoader);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  return (
    <>
      <DashboardList posts={posts} />
      {hasMore && (
        <div ref={loaderRef} style={{ height: 40, textAlign: 'center' }}>
          {loading ? 'Loading...' : 'Scroll to load more'}
        </div>
      )}
      {!hasMore && (
        <div style={{ textAlign: 'center', color: '#888' }}>No more posts</div>
      )}
    </>
  );
}
