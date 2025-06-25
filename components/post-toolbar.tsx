import { likePost } from '@/app/likePost';
import { reblogPost } from '@/app/reblogPost';
import { unlikePost } from '@/app/unlikePost';
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
  // Manage actual state externally
  const [actualState, setActualState] = useState({
    isLiked: liked,
    likeCount: noteCount,
  });

  // useOptimistic for like state and count
  const [optimisticState, addOptimistic] = useOptimistic(
    actualState,
    (state, action: { type: 'like' | 'unlike' }) => {
      if (action.type === 'like') {
        return { isLiked: true, likeCount: state.likeCount + 1 };
      }
      return { isLiked: false, likeCount: state.likeCount - 1 };
    }
  );

  // Like/unlike handler
  const handleLike = () => {
    startTransition(async () => {
      if (optimisticState.isLiked) {
        addOptimistic({ type: 'unlike' });
        try {
          await unlikePost({ id: postId, reblog_key: reblogKey });
          // Update actual state on success
          setActualState((prev) => ({
            isLiked: false,
            likeCount: prev.likeCount - 1,
          }));
        } catch (e) {
          // Optionally: revert optimistic update or show error
        }
      } else {
        addOptimistic({ type: 'like' });
        try {
          await likePost({ id: postId, reblog_key: reblogKey });
          // Update actual state on success
          setActualState((prev) => ({
            isLiked: true,
            likeCount: prev.likeCount + 1,
          }));
        } catch (e) {
          // Optionally: revert optimistic update or show error
        }
      }
    });
  };

  // Reblog handler (optimistic, but no UI change for now)
  const handleReblog = () => {
    startTransition(async () => {
      try {
        await reblogPost({
          parent_post_id: postId,
          parent_tumblelog_uuid: blogUuid,
          reblog_key: reblogKey,
        });
        toast.success('Post reblogged successfully!');
      } catch (e) {
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
        {optimisticState.likeCount.toLocaleString()} notes
      </a>
      {/* Buttons */}
      <div className="flex items-center gap-2">
        {/* Like button */}
        <button
          type="button"
          aria-label={optimisticState.isLiked ? 'Unlike' : 'Like'}
          onClick={handleLike}
          className={`group rounded p-1 transition-colors ${optimisticState.isLiked ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
        >
          <span className="sr-only">
            {optimisticState.isLiked ? 'Un-like' : 'Like'}
          </span>

          {optimisticState.isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </button>
        {/* Reblog button */}
        <button
          type="button"
          aria-label="Reblog"
          onClick={handleReblog}
          className="group rounded p-1 text-gray-400 transition-colors hover:text-green-600"
        >
          <span className="sr-only">Reblog</span>

          {/* Reblog SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
