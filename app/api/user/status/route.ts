import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ["feras@awsaftrading.com", "f3027075@gmail.com"];

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "unknown";

    // Auto-provision user
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    // Monthly Reset Check
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (dbUser.lastReportReset < thirtyDaysAgo) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { reportsThisMonth: 0, lastReportReset: new Date() }
      });
      dbUser.reportsThisMonth = 0;
    }

    const projectCount = await prisma.project.count({ where: { userId: dbUser.id } });

    return NextResponse.json({
      isAdmin,
      isPremium: dbUser.isPremium,
      projectCount,
      reportsThisMonth: dbUser.reportsThisMonth,
      bonusReports: dbUser.bonusReports
    });

  } catch (error) {
    console.error('STATUS API ERROR:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}