"use client";
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 flex flex-col items-center justify-center p-8 font-sans text-slate-800 overflow-hidden">
      
      {/* Floating Background Elements for Depth */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl"></div>

      {/* Top Right Auth Button */}
      <div className="absolute top-8 right-8 z-20">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-white/70 backdrop-blur-md text-blue-600 font-bold py-2 px-6 rounded-full border border-blue-100 shadow-sm hover:bg-white transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>

      {/* The Massive Floating Glass Card */}
      <motion.div 
        className="relative z-10 bg-white/40 backdrop-blur-xl rounded-[2rem] p-12 border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] text-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100 text-blue-600 text-sm font-medium mb-8">
          <Sparkles size={14} />
          AWSAFTRADING LLC · New York
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4">
          What number do you need today?
        </h1>
        
        <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto">
          The premium hub of one-click magic tools for marketing professionals. Instant data. Zero fluff.
        </p>

        <Link href="/dashboard" className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8 rounded-xl font-bold shadow-lg shadow-blue-600/20 cursor-pointer">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter the Hub
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

    </main>
  );
}