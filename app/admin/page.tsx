import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AppHeader from '../components/AppHeader';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['feras@awsaftrading.com', 'f3027075@gmail.com'];

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) return redirect('/sign-in');

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || '';

  if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
    return redirect('/dashboard');
  }

  // Fetch Telemetry Data
  const totalViews = await prisma.pageView.count();

  const recentViews = await prisma.pageView.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' }
  });

  const popularPages = await prisma.pageView.groupBy({
    by: ['path'],
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: 5
  });

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 p-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Admin Telemetry</h1>
        <p className="mb-8 text-sm text-slate-500">
          Monitor traffic, locations, and user behavior in real-time.
        </p>

        {/* Pass data to the Client Component */}
        <AdminClient
          totalViews={totalViews}
          recentViews={recentViews}
          popularPages={popularPages as any}
        />
      </main>
    </div>
  );
}
