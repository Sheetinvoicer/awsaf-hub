import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// Your Admin Emails
const ADMIN_EMAILS = ["feras@awsaftrading.com", "f3027075@gmail.com"];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "unknown";

    const { name, reportData } = await req.json();

    // 1. AUTO-PROVISION: Create user in DB if they don't exist yet
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });

    // 2. ADMIN BYPASS: If you are the admin, skip all limits
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    if (isAdmin) {
      const project = await prisma.project.create({
        data: { userId: dbUser.id, name, reportData },
      });
      return NextResponse.json(project);
    }

    // 3. MONTHLY RESET LOGIC
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (dbUser.lastReportReset < thirtyDaysAgo) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { reportsThisMonth: 0, lastReportReset: new Date() }
      });
      dbUser.reportsThisMonth = 0;
    }

    // 4. LIMIT LOGIC
    if (!dbUser.isPremium) {
      // FREE USER: Limit 1 report total
      const projectCount = await prisma.project.count({ where: { userId: dbUser.id } });
      if (projectCount >= 1) {
        return NextResponse.json({ 
          error: 'UPGRADE_REQUIRED', 
          message: 'You have used your 1 free report. Upgrade to Pro for 5 reports per month!' 
        }, { status: 403 });
      }
    } else {
      // PRO USER: Limit 5 reports per month + bonus reports
      const totalAllowed = 5 + dbUser.bonusReports;
      if (dbUser.reportsThisMonth >= totalAllowed) {
        return NextResponse.json({ 
          error: 'LIMIT_REACHED_EXTRA', 
          message: 'You have used all your 5 monthly reports. Buy an extra report for $25.' 
        }, { status: 403 });
      }
    }

    // 5. SAVE PROJECT & INCREMENT COUNTER
    const project = await prisma.project.create({
      data: { userId: dbUser.id, name, reportData },
    });

    if (dbUser.isPremium) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { reportsThisMonth: { increment: 1 } }
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('PROJECT SAVE ERROR:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || "unknown";

    // Auto-provision on GET as well, so "My Projects" page doesn't crash for new users
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });

    const projects = await prisma.project.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('PROJECT FETCH ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}