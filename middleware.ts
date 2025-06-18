import { auth } from '@/auth';

export default auth((req, ctx) => {
  const isLoggedIn = !!req.auth;
  const isOnHome = req.nextUrl.pathname === '/';

  // Redirect to login if accessing home page without being logged in
  if (isOnHome && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }

  // Return void when no response is needed
});

// Configure middleware to run only on the home page
export const config = {
  matcher: '/',
};
