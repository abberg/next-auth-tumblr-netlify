'use client';

import { useState } from 'react';
import { probeDashboardCursor } from './actions';

type Result = Awaited<ReturnType<typeof probeDashboardCursor>>;

export function CursorProbe() {
  const [result, setResult] = useState<Result | null>(null);
  const [replay, setReplay] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function run(repeat = false) {
    setLoading(true);
    setError('');
    try {
      const next = await probeDashboardCursor(
        repeat ? result?.anchor : undefined
      );
      if (repeat) setReplay(next);
      else {
        setResult(next);
        setReplay(null);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Test failed. Please retry.'
      );
    } finally {
      setLoading(false);
    }
  }
  const candidate =
    result?.first.allBeforeAnchor &&
    result.first.matchesKnownContinuation &&
    result.repeated?.matchesKnownContinuation &&
    result.tail?.allBeforeAnchor;
  return (
    <section className="space-y-5 py-8">
      <h1 className="font-semibold text-2xl">Dashboard cursor experiment</h1>
      <p>
        Tests whether Tumblr honors before_id using two anchors and a repeated
        request. Four read-only requests; no posts are changed.
      </p>
      <button
        className="rounded border px-4 py-2 disabled:opacity-50"
        type="button"
        disabled={loading}
        onClick={() => run()}
      >
        {loading ? 'Testing…' : 'Run cursor test'}
      </button>
      {error && <p role="alert">{error}</p>}
      {result && (
        <>
          <output className="block">
            {candidate
              ? 'Cursor appears to work in this sample. Replay after new posts arrive to check stability.'
              : 'Cursor support is unconfirmed. Review the results below; empty responses are inconclusive.'}
          </output>
          <p>
            Keep this page open. Once new dashboard posts have arrived, replay
            the saved anchor. Replay makes two read-only requests and checks
            whether the top of the dashboard has changed.
          </p>
          <button
            className="rounded border px-4 py-2 disabled:opacity-50"
            type="button"
            disabled={loading}
            onClick={() => run(true)}
          >
            Replay saved anchor
          </button>
          {replay && (
            <output className="block">
              {replay.newestId === result.newestId
                ? 'The dashboard head is unchanged; this does not yet test a moving window. '
                : 'The dashboard head has changed. '}
              {JSON.stringify(result.first.ids) ===
              JSON.stringify(replay.first.ids)
                ? 'Replay returned the same post IDs in the same order.'
                : 'Replay differs. The cursor may be ignored, or posts may have changed; inspect the IDs.'}
            </output>
          )}
          <pre className="overflow-auto rounded border p-4 text-sm">
            {JSON.stringify({ initial: result, replay }, null, 2)}
          </pre>
        </>
      )}
    </section>
  );
}
