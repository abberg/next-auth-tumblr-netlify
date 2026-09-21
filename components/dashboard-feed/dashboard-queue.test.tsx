import type { TumblrPost } from '@/types/tumblr';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { expect, it, vi } from 'vitest';
const fetch = vi.hoisted(() => vi.fn());
vi.mock('@/app/fetchDashboard', () => ({ fetchDashboard: fetch }));
vi.mock('@/components/dashboard-list', () => ({
  DashboardList: ({ posts }: { posts: TumblrPost[] }) => (
    <ul>
      {posts.map((post) => (
        <li key={post.id_string}>{post.id_string}</li>
      ))}
    </ul>
  ),
}));
import { DashboardFeed } from './dashboard-feed';

it('holds a feed load until the real notification check finishes', async () => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
  const posts: TumblrPost[] = Array.from({ length: 18 }, (_, index) => ({
    id: 1000 - index,
    id_string: String(1000 - index),
    blog: { uuid: 'test', name: 'test', url: '' },
    content: [],
    liked: false,
    note_count: 0,
    post_url: '',
    reblog_key: '',
  }));
  let finishPoll!: (posts: TumblrPost[]) => void;
  fetch
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishPoll = resolve;
        })
    )
    .mockResolvedValueOnce([]);
  render(<DashboardFeed initialPosts={posts} />);
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith({ since_id: '1000', limit: 20 })
  );
  fireEvent.click(screen.getByRole('button', { name: 'Load older posts' }));
  await act(async () => {
    await Promise.resolve();
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  // A visibility change cannot enqueue a second check while this one is waiting.
  fireEvent(document, new Event('visibilitychange'));
  expect(fetch).toHaveBeenCalledTimes(1);
  await act(async () => finishPoll([]));
  await screen.findByText(
    'No older posts are available in this dashboard window.'
  );
  expect(fetch.mock.calls.map(([params]) => params)).toEqual([
    { since_id: '1000', limit: 20 },
    { before_id: '983', limit: 18 },
  ]);
});
