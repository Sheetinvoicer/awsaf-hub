import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { path } = await req.json();

    if (!path) return NextResponse.json({ error: 'Path required' }, { status: 400 });

    // 1. Get Geo Data from Vercel Headers (Works automatically on Vercel)
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    // 2. Get User Info if logged in
    let userEmail = null;
    let isLoggedIn = false;
    if (userId) {
      const clerkUser = await currentUser();
      userEmail = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown';
      isLoggedIn = true;
    }

    // 3. Save to Database
    await prisma.pageView.create({
      data: {
        path,
        userId: userId || 'guest',
        userEmail,
        country,
        city,
        isLoggedIn
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telemetry error:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
