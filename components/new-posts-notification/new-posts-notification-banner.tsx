interface NewPostsNotificationBannerProps {
  newPostCount: number;
  isVisible: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export function NewPostsNotificationBanner({
  newPostCount,
  isVisible,
  isLoading,
  onRefresh,
}: NewPostsNotificationBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex transform justify-center py-3 transition-transform duration-300">
      <div className="rounded-md shadow-block">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="size-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden={true}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke="none"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden={true}
                className="size-6"
              >
                <path d="M15.762 7.382s-.382-.363-.75-.582C14.095 6.254 13.083 6 12 6c-1.667 0-3.083.583-4.25 1.75C6.583 8.917 6 10.333 6 12c0 1.667.583 3.083 1.75 4.25C8.917 17.417 10.333 18 12 18a5.862 5.862 0 0 0 3.475-1.1A5.81 5.81 0 0 0 17.65 14h2.1c-.467 1.767-1.417 3.208-2.85 4.325S13.833 20 12 20c-2.233 0-4.125-.775-5.675-2.325C4.775 16.125 4 14.233 4 12c0-2.233.775-4.125 2.325-5.675C7.875 4.775 9.767 4 12 4c1.15 0 2.246.246 3.3.712.79.35 1.73 1.247 1.73 1.247zm2.274 1.633L18 4h2v7h-7V9" />
              </svg>
              {newPostCount} new post{newPostCount !== 1 ? 's' : ''} available
            </>
          )}
        </button>
      </div>
    </div>
  );
}
