import { likePost } from '@/app/likePost';
import { reblogPost } from '@/app/reblogPost';
import { unlikePost } from '@/app/unlikePost';
import { LikeIcon } from '@/components/like-icon';
import { ReblogIcon } from '@/components/reblog-icon';
import { startTransition, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

interface PostToolbarProps {
  blogUuid: string;
  postId: string;
  reblogKey: string;
  noteCount?: number;
  postUrl?: string;
  liked?: boolean;
}

export function PostToolbar({
  blogUuid,
  postId,
  reblogKey,
  noteCount = 0,
  postUrl = '#',
  liked = false,
}: PostToolbarProps) {
  // Separate states for better control
  const [actualLiked, setActualLiked] = useState(liked);
  const [actualNoteCount, setActualNoteCount] = useState(noteCount);

  // Optimistic state for like status
  const [optimisticLiked, addOptimisticLike] = useOptimistic(
    actualLiked,
    (state, action: { type: 'like' | 'unlike' }) => {
      return action.type === 'like';
    }
  );

  // Optimistic state for note count
  const [optimisticNoteCount, addOptimisticNoteCount] = useOptimistic(
    actualNoteCount,
    (state, action: { type: 'increment' | 'decrement' }) => {
      return action.type === 'increment' ? state + 1 : state - 1;
    }
  );

  // Like/unlike handler
  const handleLike = () => {
    startTransition(async () => {
      if (optimisticLiked) {
        // Unlike
        addOptimisticLike({ type: 'unlike' });
        addOptimisticNoteCount({ type: 'decrement' });

        try {
          await unlikePost({ id: postId, reblog_key: reblogKey });
          // Update actual states on success
          setActualLiked(false);
          setActualNoteCount((prev) => prev - 1);
        } catch (e) {
          // Optionally: revert optimistic update or show error
          toast.error('Failed to unlike post. Please try again.');
        }
      } else {
        // Like
        addOptimisticLike({ type: 'like' });
        addOptimisticNoteCount({ type: 'increment' });

        try {
          await likePost({ id: postId, reblog_key: reblogKey });
          // Update actual states on success
          setActualLiked(true);
          setActualNoteCount((prev) => prev + 1);
        } catch (e) {
          // Optionally: revert optimistic update or show error
          toast.error('Failed to like post. Please try again.');
        }
      }
    });
  };

  // Reblog handler (optimistic, but no UI change for now)
  const handleReblog = () => {
    startTransition(async () => {
      // Optimistically increment note count for reblog
      addOptimisticNoteCount({ type: 'increment' });

      try {
        await reblogPost({
          parent_post_id: postId,
          parent_tumblelog_uuid: blogUuid,
          reblog_key: reblogKey,
        });
        // Update actual note count on success
        setActualNoteCount((prev) => prev + 1);
        toast.success('Post reblogged successfully!', {
          icon: (
            <span className="rounded-full bg-green-600 p-0.5 text-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3"
                aria-hidden={true}
              >
                <path
                  fillRule="evenodd"
                  d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ),
        });
      } catch (e) {
        // Note: The optimistic update will automatically revert on error
        toast.error('Failed to reblog post. Please try again.');
      }
    });
  };

  return (
    <div className="flex items-center justify-between py-1 text-sm">
      {/* Note count as link */}
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-gray-400 hover:text-sky-800 hover:underline"
        title="View post on Tumblr"
      >
        {optimisticNoteCount.toLocaleString()} notes
      </a>
      {/* Buttons */}
      <div className="flex items-center gap-2">
        {/* Like button */}
        <button
          type="button"
          aria-label={optimisticLiked ? 'Unlike' : 'Like'}
          onClick={handleLike}
          className={`group rounded p-1 transition-colors ${optimisticLiked ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
        >
          <LikeIcon isLiked={optimisticLiked} />
        </button>
        {/* Reblog button */}
        <button
          type="button"
          aria-label="Reblog"
          onClick={handleReblog}
          className="group rounded p-1 text-gray-400 transition-colors hover:text-green-600"
        >
          <ReblogIcon />
        </button>
      </div>
    </div>
  );
}
