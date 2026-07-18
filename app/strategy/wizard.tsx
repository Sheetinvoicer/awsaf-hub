"use client";
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Rocket, FileText, Check } from "lucide-react";
import { useState } from "react";

export default function StrategyWizard() {
  // Get logged in user's Email, fallback to guest if loading
  const { user } = useUser();
  const clerkId = user?.id || "guest_user";
  const email = user?.emailAddresses[0]?.emailAddress || "unknown";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);

  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("DTC E-Commerce");
  const [industry, setIndustry] = useState("Beauty & Skincare");
  const [keyword, setKeyword] = useState("");
  const [budget, setBudget] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setCheckedTasks([]);

    try {
      const res = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, audience, industry, keyword, budget, clerkId, email })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleTask = async (index: number, taskId: string) => {
    const newCheckedState = !checkedTasks.includes(index);
    setCheckedTasks(prev => newCheckedState ? [...prev, index] : prev.filter(i => i !== index));

    try {
      await fetch('/api/tasks/complete', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, isCompleted: newCheckedState })
      });
    } catch (e) {
      console.error("Failed to save task", e);
      setCheckedTasks(prev => newCheckedState ? prev.filter(i => i !== index) : [...prev, index]);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderText = (text: any) => {
    if (typeof text === 'string') return text;
    if (Array.isArray(text)) return text.join(", ");
    if (typeof text === 'object' && text !== null) return Object.values(text).join(". ");
    return "N/A";
  };

  const LoadingDots = () => (
    <div className="flex gap-2">
      <motion.span className="h-3 w-3 bg-blue-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}></motion.span>
      <motion.span className="h-3 w-3 bg-blue-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}></motion.span>
      <motion.span className="h-3 w-3 bg-blue-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}></motion.span>
    </div>
  );

  return (
    <div className="w-full max-w-2xl">
      {!result && !loading && (
        <motion.div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 w-16 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Step 1: Your Product</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <label htmlFor="strat-product" className="text-xs text-slate-500 font-medium">Product Name/Type</label>
                    <input id="strat-product" name="stratProduct" type="text" placeholder="e.g. Vitamin C Serum" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={product} onChange={(e) => setProduct(e.target.value)} />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <label htmlFor="strat-audience" className="text-xs text-slate-500 font-medium">Target Audience</label>
                    <select id="strat-audience" name="stratAudience" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={audience} onChange={(e) => setAudience(e.target.value)}>
                      <option>DTC E-Commerce</option>
                      <option>Shopify Store Owner</option>
                      <option>B2B Services</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Step 2: Your Niche</h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <label htmlFor="strat-industry" className="text-xs text-slate-500 font-medium">Industry Category</label>
                  <select id="strat-industry" name="stratIndustry" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option>Beauty & Skincare</option><option>Apparel & Fashion</option><option>Health & Supplements</option><option>Home Goods</option><option>Pet Care</option><option>Food & Beverage</option>
                  </select>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Step 3: SEO Target</h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <label htmlFor="strat-keyword" className="text-xs text-slate-500 font-medium">Primary Keyword to Rank For</label>
                  <input id="strat-keyword" name="stratKeyword" type="text" placeholder="e.g. best vitamin c serum" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Step 4: Ad Budget</h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <label htmlFor="strat-budget" className="text-xs text-slate-500 font-medium">Monthly Ad Budget ($)</label>
                  <input id="strat-budget" name="stratBudget" type="number" placeholder="10000" className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors"><ArrowLeft size={18} /> Back</button>
            ) : <div></div>}
            {step < 4 ? (
              <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Next <ArrowRight size={18} /></button>
            ) : (
              <button onClick={handleGenerate} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform">Generate Strategy <Rocket size={18} /></button>
            )}
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <FileText className="text-blue-500 mb-4 animate-pulse" size={48} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Generating Your Strategy...</h3>
          <p className="text-slate-500 mb-4">The AI is synthesizing your data into a unified plan.</p>
          <LoadingDots />
        </div>
      )}

      {result && !loading && (
        <motion.div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><FileText size={24} /></div>
              <h3 className="text-xl font-bold text-slate-900">Execution Battle Deck</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold">Readiness Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {(() => { const match = String(result.audit_score || "").match(/\d+/); return match ? match[0] : "50"; })()}/100
              </p>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-1">🚨 Gap Analysis</h4>
            <p className="text-slate-800 text-sm font-medium">{renderText(result.gap_analysis)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">5-Step Execution Plan</h4>
            <div className="space-y-4">
              {Array.isArray(result.action_plan) ? (
                result.action_plan.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
                    <button onClick={() => toggleTask(i, result.taskIds[i])} className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checkedTasks.includes(i) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'}`}>{checkedTasks.includes(i) && <Check size={14} />}</button>
                    <p className={`text-sm font-medium ${checkedTasks.includes(i) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{renderText(s)}</p>
                  </div>
                ))
              ) : (<p className="text-sm text-slate-700 font-medium">{renderText(result.action_plan)}</p>)}
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-center mt-6">
            <p className="text-xs text-slate-400 mb-2">Our algorithm detected you are leaving revenue on the table.</p>
            <button className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform">Claim Your Free 15-Min Forensic Audit</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}