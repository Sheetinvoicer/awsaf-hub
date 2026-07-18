import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Exclude /api, /_next, and files with extensions
    '/((?!api|_next|.*\\..*).*)',
    '/'
  ]
}