import 'next-auth';

declare module 'next-auth' {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    error?: 'RefreshTokenError';
    user?: {
      id: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface Account {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at: number;
    error?: 'RefreshTokenError';
  }
}
