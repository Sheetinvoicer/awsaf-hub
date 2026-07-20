import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PricingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white">
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Simple Marketing Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          AWSAF<span className="text-slate-400">HUB</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Pricing Content */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            Start for free. Upgrade when you need more execution power. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
          {/* FREE PLAN */}
          <Card className="flex h-full flex-col border-slate-200 p-8 shadow-sm">
            <h3 className="mb-1 text-lg font-bold text-slate-900">Free</h3>
            <p className="mb-6 text-sm text-slate-500">For trying out the engine.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
            </div>
            <ul className="mb-8 flex-grow space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> 1 Business Report
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> Full PDF Export
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> Save to Projects
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> Niche & SEO Analysis
              </li>
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-100">
                Try for Free
              </Button>
            </Link>
          </Card>

          {/* PRO PLAN (Highlighted) */}
          <Card className="flex h-full flex-col border-2 border-slate-900 p-8 shadow-xl lg:scale-105">
            <div className="mb-4">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white uppercase">
                Most Popular
              </span>
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">Pro</h3>
            <p className="mb-6 text-sm text-slate-500">For active founders scaling hard.</p>
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900">$100</span>
                <span className="ml-1 text-lg font-bold text-slate-500">/mo</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 line-through">$200/mo</p>
            </div>
            <ul className="mb-8 flex-grow space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-600" /> 5 Business Reports / month
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-600" /> Full PDF Export
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-600" /> Save to Projects
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-600" /> Budget & Competitor Analysis
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-600" /> Priority AI Generation
              </li>
            </ul>
            <Link href="/subscribe">
              <Button className="w-full bg-slate-900 hover:bg-slate-800">
                Upgrade to Pro <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </Card>

          {/* EXTRA REPORT (One-Time) */}
          <Card className="flex h-full flex-col border-slate-200 p-8 shadow-sm">
            <h3 className="mb-1 text-lg font-bold text-slate-900">Extra Report</h3>
            <p className="mb-6 text-sm text-slate-500">Top-up when you hit your limit.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-slate-900">$25</span>
              <span className="ml-1 text-lg font-bold text-slate-500">/ report</span>
            </div>
            <ul className="mb-8 flex-grow space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> 1 Additional Report
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> Full PDF Export
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> No recurring fees
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-slate-400" /> Does not expire
              </li>
            </ul>
            <Link href="/subscribe">
              <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-100">
                Buy an Extra Report
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto w-full border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 py-8 md:flex-row">
          <p className="mb-4 text-sm text-slate-500 md:mb-0">
            © 2026 AwsafTrading LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/legal"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Privacy & Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
