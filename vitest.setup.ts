import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

// Extend matchers
expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    if (received.mock.calls.length !== 1) {
      return {
        pass: false,
        message: () =>
          `Expected function to be called once, but it was called ${received.mock.calls.length} times`,
      };
    }

    const actualArgs = received.mock.calls[0];
    const pass = JSON.stringify(actualArgs) === JSON.stringify(expected);

    return {
      pass,
      message: () =>
        pass
          ? `Expected function not to be called with ${expected}`
          : `Expected function to be called with ${expected}, but was called with ${actualArgs}`,
    };
  },
});

// Mock window.fetch globally
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
