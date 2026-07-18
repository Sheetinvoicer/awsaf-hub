import { auth } from '@clerk/nextjs/server';
import { Sparkles, Rocket } from "lucide-react";
import StrategyWizard from './wizard';
import Paywall from './Paywall';
import Header from './Header';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export default async function StrategyPage() {
  // 1. Get logged in user (MUST use await in Clerk v6)
  const { userId } = await auth();

  // 2. Check Neon database to see if they are Premium
  let isPremium = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    isPremium = user?.isPremium || false;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-20 flex-col items-center py-8 gap-8 border-r border-slate-200 bg-white">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg"><Sparkles /></div>
        <nav className="flex flex-col gap-6 text-slate-500">
          <button className="hover:text-blue-600 transition-colors"><Rocket /></button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">DTC Execution Wizard</h2>
          <p className="text-slate-500 mb-8 text-center max-w-md">Generate your 5-Step Execution Battle Deck.</p>
          
          {/* THE PAYWALL LOGIC */}
          {isPremium ? <StrategyWizard /> : <Paywall />}

        </main>
      </div>
    </div>
  );
}