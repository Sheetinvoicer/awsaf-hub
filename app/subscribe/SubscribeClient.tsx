'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubscribeClient({
  email,
  isPremium
}: {
  email: string;
  isPremium: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (type: 'pro' | 'extra_report') => {
    setLoading(type);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        console.error('Stripe Error:', data);
        toast.error(data.error || 'Failed to start checkout. Check terminal.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error. Please try again.');
    }
    setLoading(null);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">Upgrade Your Plan</h1>
        <p className="mb-8 text-center text-slate-500">
          Unlock more reports to keep scaling your business.
        </p>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* PRO SUBSCRIPTION CARD */}
          <Card
            className={`flex flex-col p-8 ${!isPremium ? 'border-2 border-slate-900 shadow-lg' : 'border-slate-200 opacity-60'}`}
          >
            <div className="mb-4">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white uppercase">
                Pro Monthly
              </span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Pro Subscription</h2>
            <p className="mb-6 text-sm text-slate-500">
              For active founders who need continuous market research.
            </p>

            <div className="mb-6">
              <span className="text-lg text-slate-400 line-through">$200/mo</span>
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900">$100</span>
                <span className="ml-1 text-lg font-bold text-slate-500">/mo</span>
              </div>
              <p className="mt-1 text-xs font-bold text-emerald-600">Limited Time Discount</p>
            </div>

            <ul className="mb-8 flex-grow space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> 5 Business Reports per month
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Full PDF Export
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Save to Projects
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Priority AI Generation
              </li>
            </ul>

            {isPremium ? (
              <Button disabled className="w-full bg-slate-100 text-slate-400">
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full bg-slate-900 hover:bg-slate-800"
                disabled={loading === 'pro'}
                onClick={() => handleCheckout('pro')}
              >
                {loading === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
              </Button>
            )}
          </Card>

          {/* EXTRA REPORT CARD */}
          <Card
            className={`flex flex-col p-8 ${isPremium ? 'border-2 border-slate-900 shadow-lg' : 'border-slate-200 opacity-60'}`}
          >
            <div className="mb-4">
              <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase">
                <Zap size={12} /> One-Time
              </span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Extra Report</h2>
            <p className="mb-6 text-sm text-slate-500">
              Hit your monthly limit? Top up with a single report.
            </p>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900">$25</span>
                <span className="ml-1 text-lg font-bold text-slate-500">/ Report</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Does not expire</p>
            </div>

            <ul className="mb-8 flex-grow space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> 1 Additional Business Report
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Full PDF Export
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> Save to Projects
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" /> No recurring fees
              </li>
            </ul>

            {isPremium ? (
              <Button
                className="w-full bg-amber-500 text-white hover:bg-amber-600"
                disabled={loading === 'extra_report'}
                onClick={() => handleCheckout('extra_report')}
              >
                {loading === 'extra_report' ? 'Redirecting...' : 'Buy Extra Report'}
              </Button>
            ) : (
              <Button disabled className="w-full bg-slate-100 text-slate-400">
                Requires Pro
              </Button>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
