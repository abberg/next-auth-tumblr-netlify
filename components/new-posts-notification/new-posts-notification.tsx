'use client';

import { fetchDashboard } from '@/app/fetchDashboard';
import { useCallback, useEffect, useState } from 'react';
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

  // Check for new posts using fetchDashboard
  const checkForNewPosts = useCallback(async () => {
    if (!firstPostId) {
      return; // Can't check for new posts without a since_id
    }

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
      setIsLoading(false);
    }
  }, [firstPostId]);

  // Check for new posts periodically
  useEffect(() => {
    if (!firstPostId) {
      return; // Don't start checking until we have a firstPostId
    }

    const interval = setInterval(checkForNewPosts, 120000); // Check every 2 min

    return () => clearInterval(interval);
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
