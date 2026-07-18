"use client";
import { UserButton, useUser } from '@clerk/nextjs';
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Sparkles, Menu, Search, Activity, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "unknown";

  // Tool 1: ROAS Predictor
  const [roasResult, setRoasResult] = useState<any>(null);
  const [roasLoading, setRoasLoading] = useState(false);
  const [roasPlatform, setRoasPlatform] = useState("Meta Ads");
  const [roasBudget, setRoasBudget] = useState("");
  
  // Playbook State for Tool 1
  const [playbook, setPlaybook] = useState<string[] | null>(null);
  const [playbookLoading, setPlaybookLoading] = useState(false);

  // Tool 2: SEO Snapshot
  const [seoResult, setSeoResult] = useState<any>(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoKeyword, setSeoKeyword] = useState("");

  // Tool 3: Market Pulse
  const [trendResult, setTrendResult] = useState<any>(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendCategory, setTrendCategory] = useState("E-Commerce DTC");

  const callApi = async (tool: string, data: any, setResult: any, setLoading: any) => {
    setLoading(true);
    setResult(null);
    setPlaybook(null);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, data, email })
      });
      const resData = await res.json();
      setResult(resData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const generatePlaybook = async () => {
    setPlaybookLoading(true);
    setPlaybook(null);
    try {
      const res = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: roasPlatform, budget: roasBudget, roas: roasResult.roas })
      });
      const data = await res.json();
      if (data.steps) setPlaybook(data.steps);
    } catch (e) {
      console.error(e);
    }
    setPlaybookLoading(false);
  };

  const LoadingDots = ({ color }: { color: string }) => (
    <div className="flex gap-2">
      <motion.span className={`h-3 w-3 ${color} rounded-full`} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}></motion.span>
      <motion.span className={`h-3 w-3 ${color} rounded-full`} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}></motion.span>
      <motion.span className={`h-3 w-3 ${color} rounded-full`} animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}></motion.span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      
      <aside className="hidden md:flex w-20 flex-col items-center py-8 gap-8 border-r border-white/60 bg-white/50 backdrop-blur-xl">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg"><Sparkles /></div>
        <nav className="flex flex-col gap-6 text-slate-500">
          <button className="hover:text-blue-600 transition-colors"><Rocket /></button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        
        <header className="flex justify-between items-center p-6 border-b border-white/60 bg-white/30 backdrop-blur-xl">
          <button className="md:hidden text-slate-600"><Menu /></button>
          <div className="flex items-center gap-6 text-sm font-medium ml-auto">
            <div className="w-10 h-10 flex items-center justify-center"><UserButton /></div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">DTC Warfare Room</h2>
          <p className="text-slate-500 text-sm mb-6">Execute your E-Commerce growth strategy.</p>
          
          {/* PREMIUM STRATEGY BANNER */}
          <Link href="/strategy" className="mb-8 block group">
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 flex items-center justify-between shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Launch a new product line?</h3>
                <p className="text-blue-300 text-sm">Generate a 5-Step Execution Battle Deck</p>
              </div>
              <div className="bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-1">Deploy Plan <ArrowRight size={16} /></div>
            </div>
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* TOOL 1: ROAS Predictor (WITH PLAYBOOK) */}
            <motion.div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" whileHover={{ y: -5 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Rocket size={24} /></div>
                <h3 className="text-lg font-bold text-slate-900">ROAS Predictor</h3>
              </div>
              <div className="space-y-3 mb-6">
                <div className="bg-white/80 rounded-xl p-3 shadow-inner border border-slate-100">
                  <label htmlFor="roas-platform" className="text-xs text-slate-500 font-medium">Ad Platform</label>
                  <select id="roas-platform" name="roasPlatform" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={roasPlatform} onChange={(e) => setRoasPlatform(e.target.value)}>
                    <option>Meta Ads (Facebook/IG)</option>
                    <option>TikTok Ads</option>
                    <option>Google Ads (Search/PMAX)</option>
                  </select>
                </div>
                <div className="bg-white/80 rounded-xl p-3 shadow-inner border border-slate-100">
                  <label htmlFor="roas-budget" className="text-xs text-slate-500 font-medium">Monthly Ad Budget ($)</label>
                  <input id="roas-budget" name="roasBudget" type="number" placeholder="10000" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={roasBudget} onChange={(e) => setRoasBudget(e.target.value)} />
                </div>
              </div>
              <motion.button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50" whileTap={{ scale: 0.95 }} onClick={() => callApi('roas', { industry: 'E-Commerce DTC', budget: roasBudget }, setRoasResult, setRoasLoading)} disabled={roasLoading || !roasBudget}>⚡ Predict My Money</motion.button>
              
              <div className="mt-6 bg-slate-900 rounded-2xl p-6 min-h-[120px] flex flex-col justify-center items-center relative overflow-hidden">
                {roasLoading && <LoadingDots color="bg-emerald-400" />}
                {roasResult && !roasLoading && (
                  <motion.div className="text-center w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {roasResult.roas && <div className="flex items-center gap-2 justify-center mb-2"><TrendingUp className="text-emerald-400" /><span className="text-4xl font-bold text-emerald-400">{roasResult.roas}</span></div>}
                    {roasResult.cpa && <p className="text-xs text-slate-400 mb-2">Break-even CPA: {roasResult.cpa}</p>}
                    {roasResult.advice && <p className="text-xs text-blue-300 italic mb-4">"{roasResult.advice}"</p>}
                    
                    {!playbook && !playbookLoading && (
                      <motion.button 
                        onClick={generatePlaybook}
                        className="mt-2 w-full bg-white/10 hover:bg-white/20 border border-blue-400/30 text-blue-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <BookOpen size={16} />
                        Generate Execution Playbook
                      </motion.button>
                    )}
                  </motion.div>
                )}
                {!roasLoading && !roasResult && <p className="text-slate-600 text-sm text-center">Your projected numbers will appear here...</p>}
              </div>

              {playbookLoading && (
                <div className="mt-4 flex justify-center"><LoadingDots color="bg-blue-400" /></div>
              )}
              {playbook && !playbookLoading && (
                <motion.div 
                  className="mt-4 bg-blue-50/80 border border-blue-100 rounded-2xl p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2"><BookOpen size={14} /> 5-Step Playbook</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {playbook.map((step, i) => (
                      <li key={i} className="text-xs text-slate-700 font-medium">{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </motion.div>

            {/* TOOL 2: SEO Snapshot */}
            <motion.div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" whileHover={{ y: -5 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Search size={24} /></div>
                <h3 className="text-lg font-bold text-slate-900">Product SEO Snapshot</h3>
              </div>
              <div className="space-y-3 mb-6">
                <div className="bg-white/80 rounded-xl p-3 shadow-inner border border-slate-100">
                  <label htmlFor="seo-keyword" className="text-xs text-slate-500 font-medium">Product Keyword</label>
                  <input id="seo-keyword" name="seoKeyword" type="text" placeholder="e.g. collagen protein powder" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} />
                </div>
              </div>
              <motion.button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50" whileTap={{ scale: 0.95 }} onClick={() => callApi('seo', { keyword: seoKeyword }, setSeoResult, setSeoLoading)} disabled={seoLoading || !seoKeyword}>⚡ Get Snapshot</motion.button>
              <div className="mt-6 bg-slate-900 rounded-2xl p-6 min-h-[120px] flex flex-col justify-center items-center relative overflow-hidden">
                {seoLoading && <LoadingDots color="bg-emerald-400" />}
                {seoResult && !seoLoading && (
                  <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {seoResult.volume && <div className="flex items-center gap-2 justify-center mb-2"><TrendingUp className="text-emerald-400" /><span className="text-3xl font-bold text-emerald-400">{seoResult.volume}</span></div>}
                    {seoResult.difficulty && <p className="text-xs text-slate-400 mb-1">Difficulty: {seoResult.difficulty} | CPC: {seoResult.cpc}</p>}
                    {seoResult.advice && <p className="text-xs text-blue-300 italic">"{seoResult.advice}"</p>}
                  </motion.div>
                )}
                {!seoLoading && !seoResult && <p className="text-slate-600 text-sm text-center">Your magic numbers will appear here...</p>}
              </div>
            </motion.div>

            {/* TOOL 3: DTC Market Pulse */}
            <motion.div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" whileHover={{ y: -5 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600"><Activity size={24} /></div>
                <h3 className="text-lg font-bold text-slate-900">DTC Market Pulse</h3>
              </div>
              <div className="space-y-3 mb-6">
                <div className="bg-white/80 rounded-xl p-3 shadow-inner border border-slate-100">
                  <label htmlFor="trend-category" className="text-xs text-slate-500 font-medium">DTC Niche</label>
                  <select id="trend-category" name="trendCategory" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={trendCategory} onChange={(e) => setTrendCategory(e.target.value)}>
                    <option>Beauty & Skincare</option>
                    <option>Apparel & Fashion</option>
                    <option>Health & Supplements</option>
                    <option>Home Goods</option>
                    <option>Pet Care</option>
                    <option>Food & Beverage</option>
                  </select>
                </div>
              </div>
              <motion.button className="w-full bg-gradient-to-r from-rose-600 to-rose-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-600/20 disabled:opacity-50" whileTap={{ scale: 0.95 }} onClick={() => callApi('trends', { category: trendCategory }, setTrendResult, setTrendLoading)} disabled={trendLoading}>⚡ Get Trends</motion.button>
              <div className="mt-6 bg-slate-900 rounded-2xl p-6 min-h-[120px] flex flex-col justify-center items-center relative overflow-hidden">
                {trendLoading && <LoadingDots color="bg-rose-400" />}
                {trendResult && !trendLoading && (
                  <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {trendResult.trend1 && <p className="text-xs text-emerald-400 font-bold">1. {trendResult.trend1}</p>}
                    {trendResult.trend2 && <p className="text-xs text-emerald-400 font-bold">2. {trendResult.trend2}</p>}
                    {trendResult.trend3 && <p className="text-xs text-emerald-400 font-bold mb-2">3. {trendResult.trend3}</p>}
                    {trendResult.advice && <p className="text-xs text-blue-300 italic">"{trendResult.advice}"</p>}
                  </motion.div>
                )}
                {!trendLoading && !trendResult && <p className="text-slate-600 text-sm text-center">Your magic numbers will appear here...</p>}
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
}