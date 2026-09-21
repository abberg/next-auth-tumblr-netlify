# next-auth-tumblr-netlify
A Next.js app that uses Auth.js to connect to tumblr and deploys on Netlify

## Dashboard reading sessions

The dashboard loads older posts with Tumblr's experimentally verified
`before_id` parameter, using string post IDs. It retains a conservative
268-post session cap; this is not a promise of access beyond Tumblr's dashboard
window. Responses that do not move backward stop loading and offer a retry.

Loaded batches and the visible post's position are saved per account in
`sessionStorage`. Reloading or returning in the same tab restores that session.
The **new-post notification** fetches a fresh head and resets the session only on success.
Closing the tab ends persistence; bookmarks do not preserve a historical feed.
New-post polling does not insert posts into an active reading session.
Polling, older-post loading, and notification refreshes share a client-side FIFO
queue, so only one dashboard server action runs at a time within a tab. A failed
request reports its error to its caller and releases the next queued request.
The server-side per-user queue remains in place; separate tabs do not share the
client queue.

Run focused checks with `pnpm test:feed` and build with `pnpm build`.
In development, `/dev/dashboard-cursor` provides an authenticated, read-only
cursor experiment. It compares known continuation, multiple anchors, and replay
results. Keep the experiment open and replay after the dashboard head changes
to test stability against new posts. It is unavailable in production.
