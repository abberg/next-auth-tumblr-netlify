import { AuthProvider } from '@/components/auth-provider';
import {
  type RenderOptions,
  render as rtlRender,
} from '@testing-library/react';
import type { ReactElement } from 'react';

function render(
  ui: ReactElement,
  renderOptions: Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { render };
