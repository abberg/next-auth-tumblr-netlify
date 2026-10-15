'use client';

import {
  type TumblrActions,
  TumblrActionsProvider,
} from '@/components/tumblr-actions';
import { fetchDashboardQueued } from '@/lib/dashboard-request-queue';
import { likePost } from './likePost';
import { reblogPost } from './reblogPost';
import { unlikePost } from './unlikePost';

const serverActions: TumblrActions = {
  fetchDashboard: fetchDashboardQueued,
  likePost,
  unlikePost,
  reblogPost,
};

export function ServerTumblrActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TumblrActionsProvider actions={serverActions}>
      {children}
    </TumblrActionsProvider>
  );
}
