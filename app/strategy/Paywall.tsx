"use client";
import { useState } from 'react';

export default function Paywall() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm filter blur-sm pointer-events-none">
        <div className="h-96 flex items-center justify-center">
          <p className="text-slate-400">Premium Content Locked</p>
        </div>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-3xl border border-slate-200 shadow-lg">
        <div className="bg-slate-900 rounded-2xl p-8 text-center max-w-sm w-full">
          <h3 className="text-xl font-bold text-white mb-2">Unlock the Execution Engine</h3>
          <p className="text-slate-400 text-sm mb-6">Join 500+ DTC founders using the AI Digital COO to scale their ad spend.</p>
          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform mb-2"
          >
            {loading ? "Redirecting..." : "Subscribe for $97/mo"}
          </button>
          <p className="text-slate-500 text-xs">Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}