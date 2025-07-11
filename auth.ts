import type { Session } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';

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
        return token;
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      }
      // Access token is expired, try to refresh it
      if (!token.refresh_token) throw new TypeError('Missing refresh_token');

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
          const errorData = await response.json();
          throw errorData;
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
          refresh_token: newTokens.refresh_token,
        };
      } catch (error) {
        console.error('Error refreshing access_token', error);
        // If we fail to refresh the token, return an error so we can handle it on the page
        token.error = 'RefreshTokenError';
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
