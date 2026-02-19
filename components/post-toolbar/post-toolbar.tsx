import { likePost } from '@/app/likePost';
import { reblogPost } from '@/app/reblogPost';
import { unlikePost } from '@/app/unlikePost';
import { LikeButton } from '@/components/like-button';
import { ReblogButton } from '@/components/reblog-button';
import { startTransition, useOptimistic, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ReblogIcon } from '../reblog-icon';

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
  const actionInFlightRef = useRef(false);
  const [isActionPending, setIsActionPending] = useState(false);

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
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    setIsActionPending(true);

    startTransition(async () => {
      try {
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
      } finally {
        actionInFlightRef.current = false;
        setIsActionPending(false);
      }
    });
  };

  // Reblog handler (optimistic, but no UI change for now)
  const handleReblog = () => {
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    setIsActionPending(true);

    startTransition(async () => {
      try {
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
                <ReblogIcon className="size-3" />
              </span>
            ),
          });
        } catch (e) {
          // Note: The optimistic update will automatically revert on error
          toast.error('Failed to reblog post. Please try again.');
        }
      } finally {
        actionInFlightRef.current = false;
        setIsActionPending(false);
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
        className="font-medium text-gray-500 hover:text-gray-600 hover:underline"
        title="View post on Tumblr"
      >
        {optimisticNoteCount.toLocaleString()} notes
      </a>
      {/* Buttons */}
      <div>
        {/* Like button */}
        <LikeButton
          isLiked={optimisticLiked}
          onClick={handleLike}
          disabled={isActionPending}
        />
        {/* Reblog button */}
        <ReblogButton onClick={handleReblog} disabled={isActionPending} />
      </div>
    </div>
  );
}
