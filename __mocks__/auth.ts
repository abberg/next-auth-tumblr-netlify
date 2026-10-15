// Storybook stand-in for ../auth.ts (registered in .storybook/preview.ts).
// next-auth only runs on the server, so stories get a signed-out session.
const notAvailable = () =>
  new Response('Auth is not available in Storybook', { status: 501 });

export const GET = notAvailable;
export const POST = notAvailable;
export const auth = async () => null;
