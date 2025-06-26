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
        toast.success('Post reblogged successfully!');
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
