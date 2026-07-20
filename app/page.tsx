'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Search, Calculator, Briefcase, Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: Globe,
      title: 'Niche Finder',
      desc: 'Stop guessing where to market. AI finds the best route and audience for your product.'
    },
    {
      icon: Search,
      title: 'SEO Planner',
      desc: 'Get targeted keywords, content strategies, and high-converting title examples instantly.'
    },
    {
      icon: Calculator,
      title: 'ROAS Calculator',
      desc: 'Know your exact Return on Ad Spend and CPA before you spend a single dollar.'
    },
    {
      icon: Briefcase,
      title: 'Competitor Analysis',
      desc: 'Uncover the strengths and weaknesses of your top 3 rivals to dominate the market.'
    },
    {
      icon: Wallet,
      title: 'Launch Roadmap',
      desc: 'Get a comprehensive budget breakdown and a 30-day zero-to-launch execution plan.'
    }
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white">
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <div className="text-lg font-bold tracking-tight text-slate-900">
          AWSAF<span className="text-slate-400">HUB</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5"
        >
          <Sparkles size={14} className="text-slate-700" />
          <span className="text-xs font-medium tracking-wide text-slate-700">
            AWSAFTRADING LLC · New York
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl"
        >
          Stop guessing your <br className="hidden md:block" /> marketing strategy.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-500"
        >
          AwsafHub is an AI engine that acts as your Digital COO. In just 5 clicks, it finds your
          best niche, plans your SEO, calculates your exact ROAS, analyzes competitors, and builds a
          zero-to-launch budget roadmap. No consultants. No waiting. Just instant execution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-slate-900 px-8 text-base hover:bg-slate-800"
            >
              Try the Awsaf Hub for free <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Your 5-Click Execution Engine
          </h2>
          <p className="mt-2 text-slate-500">
            Everything you need to launch, scale, and dominate your market.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full border-slate-200 bg-white/60 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg">
                <div className="flex flex-col items-start">
                  <div className="mb-4 rounded-lg bg-slate-100 p-3">
                    <feature.icon className="h-6 w-6 text-slate-900" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Final CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <Card className="flex h-full w-full flex-col items-center justify-center border-slate-900 bg-slate-900 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-white">Ready to scale?</h3>
              <p className="mb-4 text-sm text-slate-400">Generate your first report free.</p>
              <Link href="/dashboard">
                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-200">
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto w-full border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-6 py-8 md:flex-row">
          <p className="mb-4 text-sm text-slate-500 md:mb-0">
            © 2024 AwsafTrading LLC. All rights reserved.
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
