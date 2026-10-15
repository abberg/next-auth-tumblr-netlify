'use client';

import type { TumblrPost } from '@/types/tumblr';
import { createContext, useContext } from 'react';

export interface DashboardParams {
  limit?: number;
  since_id?: string;
  before_id?: string;
}

interface PostKey {
  id: string;
  reblog_key: string;
}

interface ReblogParams {
  parent_tumblelog_uuid: string;
  parent_post_id: string;
  reblog_key: string;
}

// What the UI needs from Tumblr. Components depend on this interface only;
// the app supplies server actions and Storybook supplies fakes.
export interface TumblrActions {
  fetchDashboard: (params: DashboardParams) => Promise<TumblrPost[]>;
  likePost: (params: PostKey) => Promise<unknown>;
  unlikePost: (params: PostKey) => Promise<unknown>;
  reblogPost: (params: ReblogParams) => Promise<unknown>;
}

const TumblrActionsContext = createContext<TumblrActions | null>(null);

export function TumblrActionsProvider({
  actions,
  children,
}: {
  actions: TumblrActions;
  children: React.ReactNode;
}) {
  return (
    <TumblrActionsContext.Provider value={actions}>
      {children}
    </TumblrActionsContext.Provider>
  );
}

export function useTumblrActions(): TumblrActions {
  const actions = useContext(TumblrActionsContext);
  if (!actions) {
    throw new Error(
      'useTumblrActions must be used inside TumblrActionsProvider'
    );
  }
  return actions;
}
