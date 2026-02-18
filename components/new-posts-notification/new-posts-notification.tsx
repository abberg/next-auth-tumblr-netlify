'use client';

import { fetchDashboard } from '@/app/fetchDashboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NewPostsNotificationBanner } from './new-posts-notification-banner';

interface NewPostsNotificationProps {
  firstPostId?: string; // ID of the first post to use as since_id
}

export function NewPostsNotification({
  firstPostId,
}: NewPostsNotificationProps) {
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
        limit: 50,
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
  }, [firstPostId]);

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
    setIsVisible(false);
    setNewPostCount(0);
    window.scrollTo({ top: 0 });
    window.location.reload();
  };

  return (
    <NewPostsNotificationBanner
      newPostCount={newPostCount}
      isVisible={isVisible}
      isLoading={isLoading}
      onRefresh={handleRefresh}
    />
  );
}
