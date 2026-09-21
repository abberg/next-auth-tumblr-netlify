import type { TumblrPost } from '@/types/tumblr';
import { describe, expect, it } from 'vitest';
import {
  MAX_POSTS,
  appendBatch,
  createFeedSession,
  parseSavedSession,
} from './feed-session';

const posts = (start: number, count: number): TumblrPost[] =>
  Array.from({ length: count }, (_, index) => ({
    id: start - index,
    id_string: String(start - index),
    blog: { uuid: 'test', name: 'test', url: 'https://test.tumblr.com' },
    content: [],
    liked: false,
    note_count: 0,
    post_url: '',
    reblog_key: '',
  }));

describe('reading sessions', () => {
  it('continues from a post ID and retains batch boundaries', () => {
    const first = createFeedSession(posts(1000, 18));
    const next = appendBatch(first, posts(982, 18), 18);
    expect(next.cursor).toBe('965');
    expect(next.batches.map((batch) => batch.length)).toEqual([18, 18]);
    expect(next.startedAt).toBe(first.startedAt);
  });
  it('rejects ignored cursors without changing the session', () => {
    const first = createFeedSession(posts(1000, 18));
    expect(() => appendBatch(first, posts(1010, 18), 18)).toThrow(
      'did not return older'
    );
    expect(first.consumed).toBe(18);
  });
  it('deduplicates using string IDs within a batch', () => {
    const first = createFeedSession(posts(1000, 18));
    const next = appendBatch(first, [...posts(982, 1), ...posts(982, 1)], 18);
    expect(next.batches[1]).toHaveLength(1);
    expect(next.consumed).toBe(20);
  });
  it('stops at 268 and distinguishes an empty response', () => {
    const first = { ...createFeedSession(posts(1000, 252)), end: null };
    expect(appendBatch(first, posts(748, 16), 16).end).toBe('window');
    expect(appendBatch(createFeedSession(posts(1000, 18)), [], 18).end).toBe(
      'empty'
    );
  });
  it('restores a saved post position and rejects corrupt storage', () => {
    const session = createFeedSession(posts(1000, 18));
    const saved = { session, position: { postId: '999', top: -24 } };
    expect(parseSavedSession(JSON.stringify(saved))).toEqual(saved);
    expect(parseSavedSession('{bad')).toBeNull();
    expect(
      parseSavedSession(
        JSON.stringify({ session: { ...session, consumed: MAX_POSTS + 1 } })
      )
    ).toBeNull();
    expect(
      parseSavedSession(
        JSON.stringify({ session, position: { postId: 'unknown', top: 0 } })
      )?.position
    ).toBeNull();
  });
});
