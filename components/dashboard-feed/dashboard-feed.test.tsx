import type { TumblrPost } from '@/types/tumblr';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFeedSession } from './feed-session';
const fetch = vi.hoisted(() => vi.fn());
vi.mock('@/app/fetchDashboard', () => ({ fetchDashboard: fetch }));
vi.mock('@/components/dashboard-list', () => ({
  DashboardList: ({ posts }: { posts: TumblrPost[] }) => (
    <ul>
      {posts.map((post) => (
        <li key={post.id_string} data-post-id={post.id_string}>
          {post.id_string}
        </li>
      ))}
    </ul>
  ),
}));
vi.mock('@/components/new-posts-notification/new-posts-notification', () => ({
  NewPostsNotification: ({
    firstPostId,
    onRefresh,
  }: { firstPostId?: string; onRefresh: () => void }) => (
    <>
      <span data-testid="poll-anchor">{firstPostId}</span>
      <button type="button" onClick={onRefresh}>
        New posts available
      </button>
    </>
  ),
}));
import { TestTumblrActions } from '@/test/tumblr-actions';
import { DashboardFeed } from './dashboard-feed';
const posts = (start: number, count = 18) =>
  Array.from({ length: count }, (_, index) => ({
    id: start - index,
    id_string: String(start - index),
    blog: { uuid: 'test', name: 'test', url: '' },
    content: [],
    liked: false,
    note_count: 0,
    post_url: '',
    reblog_key: '',
  }));

beforeEach(() => {
  sessionStorage.clear();
  fetch.mockReset();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
});

describe('dashboard reading flow', () => {
  it('retries failed requests at the same cursor and blocks duplicate clicks', async () => {
    let reject!: (error: Error) => void;
    fetch.mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail;
        })
    );
    render(<DashboardFeed initialPosts={posts(1000)} accountId="one" />, {
      wrapper: TestTumblrActions,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load older posts' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loading…' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await act(async () => reject(new Error('Temporary failure')));
    expect(screen.getByRole('alert')).toHaveTextContent('Temporary failure');
    fetch.mockResolvedValueOnce(posts(982));
    fireEvent.click(screen.getByRole('button', { name: 'Retry older posts' }));
    await waitFor(() =>
      expect(screen.getAllByRole('listitem')).toHaveLength(36)
    );
    expect(fetch.mock.calls.map(([params]) => params)).toEqual([
      { before_id: '983', limit: 18 },
      { before_id: '983', limit: 18 },
    ]);
  });
  it('restores cached posts and position despite a newer initial response', async () => {
    sessionStorage.setItem(
      'dashboard-reading:v1:one',
      JSON.stringify({
        session: createFeedSession(posts(1000)),
        position: { postId: '999', top: -24 },
      })
    );
    render(<DashboardFeed initialPosts={posts(2000)} accountId="one" />, {
      wrapper: TestTumblrActions,
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(18);
    expect(screen.getByTestId('poll-anchor')).toHaveTextContent('1000');
    expect(screen.queryByText('2000')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(window.scrollBy).toHaveBeenCalledWith({
        top: 24,
        behavior: 'instant',
      })
    );
  });
  it('does not restore another account’s feed', () => {
    sessionStorage.setItem(
      'dashboard-reading:v1:one',
      JSON.stringify({
        session: createFeedSession(posts(1000)),
        position: null,
      })
    );
    render(<DashboardFeed initialPosts={posts(2000)} accountId="two" />, {
      wrapper: TestTumblrActions,
    });
    expect(screen.getByTestId('poll-anchor')).toHaveTextContent('2000');
  });
  it('starts fresh only after notification refresh succeeds', async () => {
    render(<DashboardFeed initialPosts={posts(1000)} accountId="one" />, {
      wrapper: TestTumblrActions,
    });
    fetch.mockRejectedValueOnce(new Error('offline'));
    fireEvent.click(
      screen.getByRole('button', { name: 'New posts available' })
    );
    await screen.findByRole('alert');
    expect(screen.getByTestId('poll-anchor')).toHaveTextContent('1000');
    fetch.mockResolvedValueOnce(posts(2000));
    fireEvent.click(
      screen.getByRole('button', { name: 'New posts available' })
    );
    await waitFor(() =>
      expect(screen.getByTestId('poll-anchor')).toHaveTextContent('2000')
    );
    expect(
      JSON.parse(sessionStorage.getItem('dashboard-reading:v1:one') ?? '{}')
        .session.cursor
    ).toBe('1983');
  });
  it('requests only the remaining posts at the window limit', async () => {
    sessionStorage.setItem(
      'dashboard-reading:v1:one',
      JSON.stringify({
        session: { ...createFeedSession(posts(1000, 252)), end: null },
        position: null,
      })
    );
    render(<DashboardFeed initialPosts={posts(1000)} accountId="one" />, {
      wrapper: TestTumblrActions,
    });
    fetch.mockResolvedValueOnce(posts(748, 16));
    fireEvent.click(screen.getByRole('button', { name: 'Load older posts' }));
    await screen.findByText(
      'You’ve reached the end of the available dashboard window.'
    );
    expect(fetch).toHaveBeenCalledWith({ before_id: '749', limit: 16 });
    expect(
      screen.queryByRole('button', { name: 'Load older posts' })
    ).not.toBeInTheDocument();
  });
});
