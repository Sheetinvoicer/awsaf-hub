import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AppHeader from '../components/AppHeader';
import SubscribeClient from './SubscribeClient';

export const dynamic = 'force-dynamic';

export default async function SubscribePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown';

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) redirect('/dashboard');

  // Pass isPremium to the client
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <SubscribeClient email={email} isPremium={dbUser.isPremium} />
    </div>
  );
}
