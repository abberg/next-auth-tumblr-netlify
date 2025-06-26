import { render, screen } from '@/test/test-utils';
import { signIn, signOut } from 'next-auth/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { LoginButton } from './login-button';

const mockUseSession = vi.fn() as Mock;

vi.mock('next-auth/react', () => {
  return {
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: () => mockUseSession(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('LoginButton', () => {
  it('renders sign in button when not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });
    render(<LoginButton />);
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /sign in/i });
    button.click();
    expect(signIn).toHaveBeenCalledOnce();
  });

  it('renders sign out button when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '123', name: 'Test User' },
        expires: '2025-06-15T00:00:00.000Z',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<LoginButton />);
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '123', name: 'Test User' },
        expires: '2025-06-15T00:00:00.000Z',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /sign out/i });
    button.click();
    expect(signOut).toHaveBeenCalledOnce();
  });
});
