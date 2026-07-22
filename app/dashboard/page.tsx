import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AppHeader from '../components/AppHeader';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['feras@awsaftrading.com', 'f3027075@gmail.com'];

export default async function DashboardPage() {
  const { userId } = await auth();

  // Get email if they are logged in
  let email = 'guest';
  if (userId) {
    const clerkUser = await currentUser();
    email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown';
  }

  // If they are logged in, we need to check their limits in the database
  if (userId) {
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email }
    });

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!isAdmin) {
      // Monthly Reset Check
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (dbUser.lastReportReset < thirtyDaysAgo) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { reportsThisMonth: 0, lastReportReset: new Date() }
        });
        dbUser.reportsThisMonth = 0;
      }

      // Limit Check -> Redirect to /subscribe if reached
      if (!dbUser.isPremium) {
        const projectCount = await prisma.project.count({ where: { userId: dbUser.id } });
        if (projectCount >= 1) {
          redirect('/subscribe');
        }
      } else {
        const totalAllowed = 5 + dbUser.bonusReports;
        if (dbUser.reportsThisMonth >= totalAllowed) {
          redirect('/subscribe');
        }
      }
    }
  }

  // If they are a guest (not logged in) OR they passed the limits, render the dashboard
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <DashboardClient email={email} />
    </div>
  );
}
