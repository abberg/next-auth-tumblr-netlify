import { Toaster, toast } from 'sonner';
import { ReblogIcon } from '../reblog-icon';

interface ToastDemoProps {
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  theme?: 'light' | 'dark' | 'system';
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
}

export function ToastDemo({
  position = 'bottom-right',
  theme = 'light',
  richColors = false,
  closeButton = false,
  duration = 4000,
}: ToastDemoProps) {
  const showSuccessToast = () => {
    toast.success('Post reblogged successfully!', {
      duration,
    });
  };

  const showErrorToast = () => {
    toast.error('Failed to reblog post. Please try again.', {
      duration,
    });
  };

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Toast Controls</h3>
        <p className="text-gray-600 text-sm">
          Click the buttons below to see different toast types with the current
          configuration.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={showSuccessToast}
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Success Toast
        </button>

        <button
          type="button"
          onClick={showErrorToast}
          className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Error Toast
        </button>
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <h4 className="mb-2 font-medium text-gray-900 text-sm">
          Current Configuration
        </h4>
        <div className="space-y-1 text-gray-600 text-xs">
          <div>Position: {position}</div>
          <div>Theme: {theme}</div>
          <div>Rich Colors: {richColors ? 'Yes' : 'No'}</div>
          <div>Close Button: {closeButton ? 'Yes' : 'No'}</div>
          <div>Duration: {duration}ms</div>
        </div>
      </div>

      {/* Toaster component with current configuration */}
      <Toaster
        position={position}
        theme={theme}
        richColors={richColors}
        closeButton={closeButton}
        duration={duration}
        icons={{
          success: (
            <span className="rounded-full bg-green-600 p-0.5 text-gray-50">
              <ReblogIcon className="size-3" />
            </span>
          ),
          error: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 text-red-600"
              aria-hidden={true}
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
          ),
        }}
      />
    </div>
  );
}
