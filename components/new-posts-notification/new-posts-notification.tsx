'use client';

import { useTumblrActions } from '@/components/tumblr-actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NewPostsNotificationBanner } from './new-posts-notification-banner';

interface NewPostsNotificationProps {
  firstPostId?: string; // ID of the first post to use as since_id
  onRefresh: () => void;
  refreshing?: boolean;
}

export function NewPostsNotification({
  firstPostId,
  onRefresh,
  refreshing = false,
}: NewPostsNotificationProps) {
  const { fetchDashboard } = useTumblrActions();
  const [newPostCount, setNewPostCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestInFlightRef = useRef(false);

  // Check for new posts using fetchDashboard
  const checkForNewPosts = useCallback(async () => {
    if (!firstPostId || requestInFlightRef.current) {
      return; // Can't check for new posts without a since_id
    }

    requestInFlightRef.current = true;
    setIsLoading(true);

    try {
      const newPosts = await fetchDashboard({
        since_id: firstPostId,
        limit: 20,
      });
      if (Array.isArray(newPosts) && newPosts.length > 0) {
        setNewPostCount(newPosts.length);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking for new posts:', error);
      // Don't show notification on error, just log it
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [fetchDashboard, firstPostId]);

  // Only check for new posts when the tab is visible
  useEffect(() => {
    if (!firstPostId) {
      return;
    }

    function startInterval() {
      if (intervalRef.current) return;
      // Check immediately when tab becomes visible
      checkForNewPosts();
      intervalRef.current = setInterval(checkForNewPosts, 120000); // 2 min
    }

    function clearIntervalIfExists() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        startInterval();
      } else {
        clearIntervalIfExists();
      }
    }

    if (document.visibilityState === 'visible') {
      startInterval();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearIntervalIfExists();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForNewPosts, firstPostId]);

  // Handle refresh button click
  const handleRefresh = () => {
    // Keep the banner available for retry until a successful refresh remounts it.
    onRefresh();
  };

  return (
    <NewPostsNotificationBanner
      newPostCount={newPostCount}
      isVisible={isVisible}
      isLoading={isLoading || refreshing}
      onRefresh={handleRefresh}
    />
  );
}
