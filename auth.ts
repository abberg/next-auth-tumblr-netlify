import type { Session } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';

const TOKEN_REFRESH_BUFFER_SECONDS = 60;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    {
      id: 'tumblr',
      name: 'Tumblr',
      type: 'oauth',
      authorization: {
        url: 'https://www.tumblr.com/oauth2/authorize',
        params: {
          scope: 'write offline_access',
          state: process.env.AUTH_TUMBLR_STATE,
        },
      },
      token: {
        url: 'https://api.tumblr.com/v2/oauth2/token',
        async conform(response: Response) {
          const body = await response.json();
          if (!response.ok) {
            throw new Error('Failed to retrieve access token');
          }
          body.id_token = undefined;
          return new Response(JSON.stringify(body));
        },
      },
      userinfo: {
        url: 'https://api.tumblr.com/v2/user/info',
        async request({ tokens }: { tokens: { access_token: string } }) {
          const response = await fetch('https://api.tumblr.com/v2/user/info', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });
          const data = await response.json();
          const { user } = data.response;
          return {
            id: user.name,
            name: user.name,
            image: user.blogs?.[0]?.avatar?.[0]?.url,
          };
        },
      },
      clientId: process.env.AUTH_TUMBLR_CLIENT_ID,
      clientSecret: process.env.AUTH_TUMBLR_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Initial login, set the access token and refresh token
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at =
          Math.floor(Date.now() / 1000) + (account.expires_in || 0);
        token.error = undefined;
        return token;
      }

      const expiresAt = token.expires_at ?? 0;
      if (
        Date.now() <
        Math.max(expiresAt - TOKEN_REFRESH_BUFFER_SECONDS, 0) * 1000
      ) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      }

      // Access token is expired, try to refresh it
      if (!token.refresh_token) {
        token.error = 'RefreshTokenError';
        return token;
      }

      try {
        const response = await fetch('https://api.tumblr.com/v2/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.AUTH_TUMBLR_CLIENT_ID || '',
            client_secret: process.env.AUTH_TUMBLR_CLIENT_SECRET || '',
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token,
          }),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!response.ok) {
          let errorData: { error?: string; error_description?: string } | null =
            null;
          try {
            errorData = await response.json();
          } catch {
            errorData = null;
          }

          const isFatalRefreshError =
            response.status === 400 ||
            response.status === 401 ||
            response.status === 403 ||
            errorData?.error === 'invalid_grant';

          if (isFatalRefreshError) {
            token.error = 'RefreshTokenError';
          } else {
            // Do not force re-authentication for transient refresh failures
            token.error = 'TemporaryRefreshError';
          }
          return token;
        }

        const newTokens: {
          access_token: string;
          expires_in: number;
          refresh_token?: string;
        } = await response.json();

        return {
          ...token,
          access_token: newTokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
          refresh_token: newTokens.refresh_token ?? token.refresh_token,
          error: undefined,
        };
      } catch (error) {
        console.error('Error refreshing access_token', error);
        // Keep session alive on transient refresh/network issues.
        token.error = 'TemporaryRefreshError';
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        error: token.error,
      };
    },
  },
});
