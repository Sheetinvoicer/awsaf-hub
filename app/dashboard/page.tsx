import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AppHeader from "../components/AppHeader";
import DashboardClient from "./DashboardClient";

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ["feras@awsaftrading.com", "f3027075@gmail.com"];

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || "unknown";

  // 1. Auto-provision user in DB
  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  // 2. Admin Bypass
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  
  if (!isAdmin) {
    // 3. Monthly Reset Check
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (dbUser.lastReportReset < thirtyDaysAgo) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { reportsThisMonth: 0, lastReportReset: new Date() }
      });
      dbUser.reportsThisMonth = 0; // update local variable
    }

    // 4. Limit Check -> Redirect to /subscribe if reached
    if (!dbUser.isPremium) {
      const projectCount = await prisma.project.count({ where: { userId: dbUser.id } });
      if (projectCount >= 1) {
        redirect('/subscribe');
      }
    } else {
      const totalAllowed = 5 + dbUser.bonusReports;
      if (dbUser.reportsThisMonth >= totalAllowed) {
        redirect('/subscribe?type=extra');
      }
    }
  }

  // 5. If they pass all checks, render the dashboard
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <DashboardClient email={email} />
    </div>
  );
}