import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Removed /dashboard from protected routes to allow Guest Mode
const isProtectedRoute = createRouteMatcher(['/strategy(.*)', '/projects(.*)', '/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // If it's a protected route and they aren't logged in, send to sign-in
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
