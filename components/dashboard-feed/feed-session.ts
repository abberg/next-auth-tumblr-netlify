import type { TumblrPost } from '@/types/tumblr';

export const PAGE_SIZE = 18;
// Observed dashboard window limit. A cursor does not guarantee older history.
export const MAX_POSTS = 268;

export interface ReadingPosition {
  postId: string;
  top: number;
}

export interface FeedSession {
  version: 1;
  startedAt: string;
  batches: TumblrPost[][];
  consumed: number;
  cursor: string | null;
  end: 'window' | 'empty' | null;
}

export function createFeedSession(posts: TumblrPost[]): FeedSession {
  return {
    version: 1,
    startedAt: new Date().toISOString(),
    batches: [posts],
    consumed: posts.length,
    cursor: posts.at(-1)?.id_string ?? null,
    end:
      posts.length >= MAX_POSTS
        ? 'window'
        : posts.length < PAGE_SIZE
          ? 'empty'
          : null,
  };
}

export function appendBatch(
  session: FeedSession,
  posts: TumblrPost[],
  limit: number
): FeedSession {
  if (
    posts.length > limit ||
    posts.some(
      (post) =>
        !/^\d+$/.test(post.id_string) ||
        !session.cursor ||
        BigInt(post.id_string) >= BigInt(session.cursor)
    )
  ) {
    throw new Error(
      'Tumblr did not return older posts. Your reading position has been kept.'
    );
  }
  const seen = new Set(session.batches.flat().map((post) => post.id_string));
  const unique = posts.filter((post) => {
    if (seen.has(post.id_string)) return false;
    seen.add(post.id_string);
    return true;
  });
  const consumed = session.consumed + posts.length;
  return {
    ...session,
    batches: unique.length ? [...session.batches, unique] : session.batches,
    consumed,
    cursor: posts.at(-1)?.id_string ?? session.cursor,
    end:
      consumed >= MAX_POSTS ? 'window' : posts.length < limit ? 'empty' : null,
  };
}

// Storage is optional and may contain an old schema or an interrupted write.
export function parseSavedSession(
  raw: string | null
): { session: FeedSession; position: ReadingPosition | null } | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    const s = saved.session;
    if (
      s?.version !== 1 ||
      typeof s.startedAt !== 'string' ||
      !Number.isInteger(s.consumed) ||
      s.consumed < 0 ||
      s.consumed > MAX_POSTS ||
      ![null, 'window', 'empty'].includes(s.end) ||
      !(
        s.cursor === null ||
        (typeof s.cursor === 'string' && /^\d+$/.test(s.cursor))
      ) ||
      !Array.isArray(s.batches) ||
      !s.batches.every(
        (batch: unknown) =>
          Array.isArray(batch) &&
          batch.every(
            (post) =>
              post &&
              typeof post.id_string === 'string' &&
              /^\d+$/.test(post.id_string) &&
              post.blog &&
              typeof post.blog.name === 'string' &&
              Array.isArray(post.content)
          )
      )
    )
      return null;
    const posts = s.batches.flat();
    if (
      posts.length > s.consumed ||
      (s.end === null && (!s.cursor || s.consumed >= MAX_POSTS))
    )
      return null;
    const p = saved.position;
    const position =
      p &&
      typeof p.postId === 'string' &&
      Number.isFinite(p.top) &&
      posts.some((post: TumblrPost) => post.id_string === p.postId)
        ? p
        : null;
    return { session: s, position };
  } catch {
    return null;
  }
}
