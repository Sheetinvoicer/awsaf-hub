'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';

export default function AppHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || '';
  const isAdmin = email === 'feras@awsaftrading.com' || email === 'f3027075@gmail.com';

  const navLinks = [
    { href: '/dashboard', label: 'New Report' },
    { href: '/projects', label: 'My Projects' },
    { href: '/subscribe', label: 'Upgrade' } // <-- Add this
  ];

  // Add Admin link if admin
  if (isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-slate-900">
            AWSAF<span className="text-slate-400">HUB</span>
          </Link>
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-slate-900',
                  pathname === link.href ? 'text-slate-900' : 'text-slate-500'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
