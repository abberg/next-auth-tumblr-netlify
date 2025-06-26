import { Toaster, toast } from 'sonner';

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

  const showInfoToast = () => {
    toast.info('This is an informational message.', {
      duration,
    });
  };

  const showWarningToast = () => {
    toast.warning('This is a warning message.', {
      duration,
    });
  };

  const showCustomToast = () => {
    toast('This is a custom toast message.', {
      duration,
    });
  };

  const showPromiseToast = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Loading...',
      success: 'Promise resolved!',
      error: 'Promise rejected!',
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

        <button
          type="button"
          onClick={showInfoToast}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Info Toast
        </button>

        <button
          type="button"
          onClick={showWarningToast}
          className="rounded-md bg-yellow-600 px-4 py-2 font-medium text-sm text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Warning Toast
        </button>

        <button
          type="button"
          onClick={showCustomToast}
          className="rounded-md bg-gray-600 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Custom Toast
        </button>

        <button
          type="button"
          onClick={showPromiseToast}
          className="rounded-md bg-purple-600 px-4 py-2 font-medium text-sm text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Promise Toast
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
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
        }}
      />
    </div>
  );
}
