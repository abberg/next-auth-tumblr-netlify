import { auth } from '@/auth';
import { DashboardList } from '@/components/dashboard-list';
import { LoginButton } from '@/components/login-button';
import type { TumblrResponse } from '@/types/tumblr';

async function fetchDashboard() {
  const session = await auth();
  if (!session?.access_token) {
    throw new Error('User is not authenticated');
  }

  const params = new URLSearchParams({
    limit: '18',
    npf: 'true',
  });

  const url = `http://api.tumblr.com/v2/user/dashboard?${params}`;
  const makeRequest = async (token: string) => {
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const res = await makeRequest(session.access_token);

  if (!res.ok) {
    if (res.status === 401 && session.refresh_token) {
      try {
        // User will be redirected to sign in page by the auth configuration
        throw new Error('Session expired. Please sign in again.');
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw new Error('Session expired. Please sign in again.');
      }
    } else {
      throw new Error(`Request failed with status ${res.status}`);
    }
  }

  const data: TumblrResponse = await res.json();
  return data.response.posts;
}

export default async function Home() {
  const session = await auth();

  // If there's a refresh token error, redirect to login
  if (session?.error === 'RefreshTokenError') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Session expired. Please sign in again.</p>
        <LoginButton />
      </div>
    );
  }

  let posts: TumblrResponse['response']['posts'] | undefined;

  if (session && !session.error) {
    try {
      posts = await fetchDashboard();
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      // Handle the error appropriately, maybe show an error message
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-8 shadow-md">
      <header className="flex items-center justify-between py-4">
        <h1 className="font-bold text-2xl">Tumblr Client</h1>
        <div className="flex gap-4">
          <LoginButton />
        </div>
      </header>
      <main className="flex-1">
        {session && !session.error ? (
          <div>
            <p className="mb-4">Welcome, {session.user?.name}!</p>
            <DashboardList posts={posts} />
          </div>
        ) : (
          <p>Please sign in to view your Tumblr dashboard</p>
        )}
      </main>
    </div>
  );
}
