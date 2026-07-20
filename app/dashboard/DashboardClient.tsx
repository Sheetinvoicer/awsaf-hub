"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, Search, Calculator, Download, ChevronDown, Link2, Briefcase, Wallet, Save, Sparkles } from "lucide-react";
import { useState } from "react";
import { jsPDF } from "jspdf";
import toast from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardClient({ email }: { email: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [nicheResult, setNicheResult] = useState<any>(null);
  const [seoResult, setSeoResult] = useState<any>(null);
  const [roasResult, setRoasResult] = useState<any>(null);
  const [bizResult, setBizResult] = useState<any>(null);
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const [platform, setPlatform] = useState("Meta Ads");
  const [showNicheAdvanced, setShowNicheAdvanced] = useState(false);
  const [showSeoAdvanced, setShowSeoAdvanced] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const callEngine = async (stepNum: number, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth-engine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step: stepNum, data: payload }) });
      const data = await res.json();
      if (stepNum === 1) { setNicheResult(data); setShowNicheAdvanced(false); }
      if (stepNum === 2) { setSeoResult(data); setShowSeoAdvanced(false); }
      if (stepNum === 3) setRoasResult(data);
      if (stepNum === 4) setBizResult(data);
      if (stepNum === 5) setBudgetResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    if (!product) return;
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const res = await fetch('/api/suggest-audience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product }) });
      const data = await res.json();
      if (data.audiences) setSuggestions(data.audiences);
    } catch (e) { console.error(e); }
    setLoadingSuggestions(false);
  };

  const handleSaveProject = async () => {
    const reportData = { niche: nicheResult, seo: seoResult, roas: roasResult, business: bizResult, budget: budgetResult, platform, product, audience };
    try {
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${product} - ${audience}`, reportData }) });
      const data = await res.json();
      
      // If backend says limit reached, redirect to subscribe page
      if (data.error === 'UPGRADE_REQUIRED' || data.error === 'LIMIT_REACHED_EXTRA') {
        toast.error(data.message);
        window.location.href = '/subscribe';
        return;
      }
      
      if (data.id) toast.success('Project saved successfully! View it in My Projects.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save project.');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("Awsaf Hub - Business Report", 20, 20);
    doc.setFontSize(10); doc.setTextColor(148, 163, 184); doc.text(`Product: ${product} | Target: ${audience}`, 20, 28);
    let y = 50;
    const addSectionTitle = (title: string) => { if (y > 260) { doc.addPage(); y = 20; } doc.setFontSize(14); doc.setTextColor(37, 99, 235); doc.text(title, 20, y); y += 7; };
    const addLabelAndText = (label: string, text: string, color: [number, number, number] = [51, 65, 85]) => { if (y > 270) { doc.addPage(); y = 20; } doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.text(`${label}:`, 20, y); y += 5; doc.setTextColor(color[0], color[1], color[2]); const lines = doc.splitTextToSize(text || 'N/A', 170); doc.text(lines, 20, y); y += lines.length * 5 + 4; };
    const addBulletList = (label: string, items: string[], color: number[] = [51, 65, 85]) => { if (y > 270) { doc.addPage(); y = 20; } doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.text(`${label}:`, 20, y); y += 5; doc.setTextColor(color[0], color[1], color[2]); items.forEach(item => { if (y > 275) { doc.addPage(); y = 20; } const lines = doc.splitTextToSize(`• ${item}`, 165); doc.text(lines, 25, y); y += lines.length * 5; }); y += 4; };

    addSectionTitle("1. Niche & Market Route"); addLabelAndText("Best Route", nicheResult?.best_route); addLabelAndText("Persona", nicheResult?.audience_persona); addBulletList("Marketing Angles", nicheResult?.marketing_angles || []);
    if (nicheResult?.channels_to_check) addBulletList("Leads & Channels", nicheResult.channels_to_check, [37, 99, 235]);
    addSectionTitle("2. SEO Strategy"); addBulletList("Primary Keywords", seoResult?.primary_keywords || []); addLabelAndText("Content Strategy", seoResult?.content_strategy); addLabelAndText("Expected Timeline", seoResult?.expected_timeline, [22, 163, 74]);
    if (seoResult?.blog_titles) addBulletList("Blog Titles", seoResult.blog_titles, [37, 99, 235]);
    if (seoResult?.landing_page_titles) addBulletList("Landing Page Titles", seoResult.landing_page_titles, [37, 99, 235]);
    addSectionTitle("3. ROAS Projections"); addLabelAndText("Ad Platform", platform); addLabelAndText("Expected ROAS", roasResult?.expected_roas, [22, 163, 74]); addLabelAndText("Expected CPA", roasResult?.expected_cpa); addLabelAndText("Justification", roasResult?.justification);
    if (bizResult) { addSectionTitle("4. Market Analysis"); addLabelAndText("Market Size", bizResult.market_size); addBulletList("Market Trends", bizResult.market_trends || []); addBulletList("Market Challenges", bizResult.market_challenges || [], [185, 28, 28]); doc.addPage(); y = 20; addSectionTitle("5. Competitor Analysis"); if (bizResult.top_competitors) { bizResult.top_competitors.forEach((comp: any, i: number) => { if (y > 250) { doc.addPage(); y = 20; } doc.setFontSize(12); doc.setTextColor(15, 23, 42); doc.text(`Competitor ${i + 1}: ${comp.name}`, 20, y); y += 6; addLabelAndText("Strengths", comp.strengths, [22, 101, 52]); addLabelAndText("Weaknesses", comp.weaknesses, [185, 28, 28]); y += 2; }); } }
    if (budgetResult) { doc.addPage(); y = 20; addSectionTitle("6. Budget & Launch Roadmap"); addLabelAndText("Estimated Budget Range", `${budgetResult.total_min_budget || 'N/A'} - ${budgetResult.total_max_budget || 'N/A'}`, [15, 23, 42]); if (budgetResult.budget_breakdown) { doc.setFontSize(11); doc.setTextColor(51, 65, 85); doc.text("Budget Breakdown:", 20, y); y += 6; budgetResult.budget_breakdown.forEach((item: any) => { if (y > 275) { doc.addPage(); y = 20; } doc.text(`- ${item.category}: ${item.min_cost} - ${item.max_cost}`, 20, y); y += 5; }); y += 5; } if (budgetResult.launch_phases) { doc.setFontSize(11); doc.setTextColor(51, 65, 85); doc.text("Launch Phases:", 20, y); y += 6; budgetResult.launch_phases.forEach((phase: any) => { if (y > 260) { doc.addPage(); y = 20; } doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.text(phase.phase_name, 20, y); y += 5; phase.action_items.forEach((action: string) => { if (y > 275) { doc.addPage(); y = 20; } doc.setTextColor(100, 116, 139); const lines = doc.splitTextToSize(`• ${action}`, 165); doc.text(lines, 25, y); y += lines.length * 5; }); y += 4; }); } }
    const pageCount = doc.getNumberOfPages(); for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(9); doc.setTextColor(148, 163, 184); doc.text("Powered by AWSAFTRADING LLC", 20, 290); }
    doc.save(`Awsaf_Business_Report_${product.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <main className="flex-1 p-8 flex flex-col items-center">
      <div className="flex gap-4 mb-12 w-full max-w-2xl">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className={`flex-1 h-1 rounded-full ${step >= i ? 'bg-slate-900' : 'bg-slate-200'}`}></div>)}
      </div>
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && ( <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}> <Card className="p-8 shadow-sm border-slate-200"> <div className="flex items-center gap-3 mb-6"> <div className="p-2 bg-slate-100 rounded-lg text-slate-900"><Globe size={20} /></div> <h2 className="text-lg font-bold text-slate-900">Step 1: Niche Finder</h2> </div> <div className="space-y-4 mb-6"> <div> <Label htmlFor="product">Product Details</Label> <Input id="product" placeholder="e.g. Organic Matcha Green Tea" value={product} onChange={(e) => setProduct(e.target.value)} className="mt-1" /> </div> <div> <Label htmlFor="audience">Focus Group / Country</Label> <Input id="audience" placeholder="e.g. Fitness enthusiasts in USA" value={audience} onChange={(e) => setAudience(e.target.value)} className="mt-1" /> <Button variant="outline" size="sm" onClick={fetchSuggestions} disabled={loadingSuggestions || !product} className="mt-2"> {loadingSuggestions ? "Thinking..." : <><Sparkles size={14} className="mr-2" /> Get AI Suggestions</>} </Button> {suggestions.length > 0 && ( <div className="mt-3 flex flex-wrap items-center gap-2"> <span className="text-xs text-slate-400 font-medium mr-1">AI suggested audiences:</span> {suggestions.map((grp) => ( <button key={grp} type="button" onClick={() => setAudience(grp)} className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-900 hover:text-white transition-colors">{grp}</button> ))} </div> )} </div> </div> <Button onClick={() => callEngine(1, { product, audience })} disabled={loading || !product || !audience || !!nicheResult} className="w-full bg-slate-900 hover:bg-slate-800"> {nicheResult ? "Generated ✓" : loading ? "Analyzing Market..." : "Find My Marketing Route"} </Button> {nicheResult && ( <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6"> <p className="text-xs text-slate-500 uppercase font-bold mb-1">Best Route:</p> <p className="text-xl font-bold text-slate-900 mb-4">{nicheResult.best_route}</p> <p className="text-xs text-slate-500 uppercase font-bold mb-1">Persona:</p> <p className="text-sm text-slate-700 mb-4">{nicheResult.audience_persona}</p> <Button variant="outline" size="sm" onClick={() => setShowNicheAdvanced(!showNicheAdvanced)} className="w-full mb-4"> <Link2 size={14} className="mr-2" /> {showNicheAdvanced ? "Hide" : "Show"} Advanced </Button> <AnimatePresence> {showNicheAdvanced && nicheResult.channels_to_check && ( <motion.ul className="text-sm text-slate-600 list-disc list-inside mb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}> {nicheResult.channels_to_check.map((c: string, i: number) => <li key={i}>{c}</li>)} </motion.ul> )} </AnimatePresence> <Button onClick={() => setStep(2)} className="w-full bg-slate-900 hover:bg-slate-800"> I'm pleased. Plan my SEO <ArrowRight size={16} className="ml-2" /> </Button> </div> )} </Card> </motion.div> )}
          {step === 2 && ( <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}> <Card className="p-8 shadow-sm border-slate-200"> <div className="flex items-center gap-3 mb-6"> <div className="p-2 bg-slate-100 rounded-lg text-slate-900"><Search size={20} /></div> <h2 className="text-lg font-bold text-slate-900">Step 2: SEO Planner</h2> </div> <p className="text-sm text-slate-500 mb-4">Based on your route: <span className="font-bold text-slate-900">{nicheResult?.best_route}</span></p> <Button onClick={() => callEngine(2, { product, audience, best_route: nicheResult.best_route })} disabled={loading || !!seoResult} className="w-full bg-slate-900 hover:bg-slate-800"> {seoResult ? "Generated ✓" : loading ? "Researching Keywords..." : "Generate SEO Plan"} </Button> {seoResult && ( <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6"> <div className="flex gap-2 mb-4 flex-wrap"> {seoResult.primary_keywords?.map((k: string, i: number) => <span key={i} className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">{k}</span>)} </div> <p className="text-xs text-slate-500 uppercase font-bold mb-1">Content Strategy:</p> <p className="text-sm text-slate-700 mb-4">{seoResult.content_strategy}</p> <p className="text-xs text-slate-500 uppercase font-bold mb-1">Timeline:</p> <p className="text-sm text-slate-900 font-bold mb-4">{seoResult.expected_timeline}</p> <Button variant="outline" size="sm" onClick={() => setShowSeoAdvanced(!showSeoAdvanced)} className="w-full mb-4"> <Link2 size={14} className="mr-2" /> {showSeoAdvanced ? "Hide" : "Show"} Title Examples </Button> <AnimatePresence> {showSeoAdvanced && ( <motion.div className="space-y-4 mb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}> <div> <p className="text-xs text-slate-500 uppercase font-bold mb-2">Blog Titles:</p> <ul className="text-sm text-slate-600 list-disc list-inside">{seoResult.blog_titles?.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul> </div> <div> <p className="text-xs text-slate-500 uppercase font-bold mb-2">Landing Page Titles:</p> <ul className="text-sm text-slate-600 list-disc list-inside">{seoResult.landing_page_titles?.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul> </div> </motion.div> )} </AnimatePresence> <Button onClick={() => setStep(3)} className="w-full bg-slate-900 hover:bg-slate-800"> Calculate my ROAS <ArrowRight size={16} className="ml-2" /> </Button> </div> )} </Card> </motion.div> )}
          {step === 3 && ( <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}> <Card className="p-8 shadow-sm border-slate-200"> <div className="flex items-center gap-3 mb-6"> <div className="p-2 bg-slate-100 rounded-lg text-slate-900"><Calculator size={20} /></div> <h2 className="text-lg font-bold text-slate-900">Step 3: ROAS Calculator</h2> </div> <div className="mb-6"> <Label htmlFor="platform">Ad Platform</Label> <select id="platform" className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" value={platform} onChange={(e) => setPlatform(e.target.value)}> <option>Meta Ads (Facebook/IG)</option> <option>TikTok Ads</option> <option>Google Ads (Search/PMAX)</option> <option>LinkedIn Ads</option> <option>YouTube Ads</option> </select> </div> <Button onClick={() => callEngine(3, { product, audience, platform, keywords: seoResult.primary_keywords?.join(", ") })} disabled={loading || !!roasResult} className="w-full bg-slate-900 hover:bg-slate-800"> {roasResult ? "Generated ✓" : loading ? "Calculating Projections..." : "Calculate Expected ROAS"} </Button> {roasResult && ( <div className="mt-6 bg-slate-900 rounded-xl p-6 text-center"> <p className="text-xs text-slate-400 uppercase font-bold mb-2">Expected ROAS</p> <p className="text-4xl font-bold text-white mb-4">{roasResult.expected_roas}</p> <p className="text-xs text-slate-400 uppercase font-bold mb-2">Expected CPA</p> <p className="text-xl font-bold text-white mb-4">{roasResult.expected_cpa}</p> <p className="text-xs text-slate-300 italic mt-4">"{roasResult.justification}"</p> <Button onClick={() => setStep(4)} className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-200"> Analyze Market & Competitors <ArrowRight size={16} className="ml-2" /> </Button> </div> )} </Card> </motion.div> )}
          {step === 4 && ( <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}> <Card className="p-8 shadow-sm border-slate-200"> <div className="flex items-center gap-3 mb-6"> <div className="p-2 bg-slate-100 rounded-lg text-slate-900"><Briefcase size={20} /></div> <h2 className="text-lg font-bold text-slate-900">Step 4: Business Analysis</h2> </div> <Button onClick={() => callEngine(4, { product, audience })} disabled={loading || !!bizResult} className="w-full bg-slate-900 hover:bg-slate-800"> {bizResult ? "Generated ✓" : loading ? "Analyzing Competitors..." : "Generate Market & Competitor Analysis"} </Button> {bizResult && ( <div className="mt-6 space-y-6"> <div className="bg-slate-50 border border-slate-200 rounded-xl p-6"> <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Market Analysis</h3> <p className="text-xs text-slate-500 mb-1">Market Size:</p> <p className="text-sm text-slate-900 font-bold mb-4">{bizResult.market_size}</p> <p className="text-xs text-slate-500 mb-1">Trends:</p> <ul className="text-sm text-slate-700 list-disc list-inside mb-4">{bizResult.market_trends?.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul> <p className="text-xs text-slate-500 mb-1">Challenges:</p> <ul className="text-sm text-rose-600 list-disc list-inside">{bizResult.market_challenges?.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul> </div> <div className="bg-white border border-slate-200 rounded-xl p-6"> <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Top Competitors</h3> <div className="space-y-4"> {bizResult.top_competitors?.map((comp: any, i: number) => ( <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100"> <p className="text-md font-bold text-slate-900 mb-2">{comp.name}</p> <p className="text-xs text-emerald-700 font-medium"><span className="font-bold">Strengths:</span> {comp.strengths}</p> <p className="text-xs text-rose-700 font-medium mt-1"><span className="font-bold">Weaknesses:</span> {comp.weaknesses}</p> </div> ))} </div> </div> <Button onClick={() => setStep(5)} className="w-full bg-slate-900 hover:bg-slate-800"> Plan my Budget & Launch <ArrowRight size={16} className="ml-2" /> </Button> </div> )} </Card> </motion.div> )}
          {step === 5 && ( <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}> <Card className="p-8 shadow-sm border-slate-200"> <div className="flex items-center gap-3 mb-6"> <div className="p-2 bg-slate-100 rounded-lg text-slate-900"><Wallet size={20} /></div> <h2 className="text-lg font-bold text-slate-900">Step 5: Budget & Launch Roadmap</h2> </div> <Button onClick={() => callEngine(5, { product, audience, platform, roas: roasResult?.expected_roas, cpa: roasResult?.expected_cpa })} disabled={loading || !!budgetResult} className="w-full bg-slate-900 hover:bg-slate-800"> {budgetResult ? "Generated ✓" : loading ? "Planning Launch..." : "Generate Budget & Roadmap"} </Button> {budgetResult && ( <div className="mt-6 space-y-6"> <div className="bg-slate-900 rounded-xl p-6"> <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Accurate Budget Analysis</h3> <p className="text-xs text-slate-400 mb-1">Estimated Total Budget Range:</p> <p className="text-xl font-bold text-white mb-4">{budgetResult.total_min_budget} - {budgetResult.total_max_budget}</p> <div className="space-y-2"> {budgetResult.budget_breakdown?.map((item: any, i: number) => ( <div key={i} className="flex justify-between items-center bg-slate-800 p-2 rounded-lg"> <span className="text-sm text-slate-300">{item.category}</span> <span className="text-sm font-bold text-white">{item.min_cost} - {item.max_cost}</span> </div> ))} </div> </div> <div className="bg-white border border-slate-200 rounded-xl p-6"> <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Zero to Launch Roadmap</h3> <div className="space-y-4"> {budgetResult.launch_phases?.map((phase: any, i: number) => ( <div key={i} className="border-l-2 border-slate-900 pl-4"> <p className="text-md font-bold text-slate-900">{phase.phase_name}</p> <ul className="text-sm text-slate-600 list-disc list-inside mt-1">{phase.action_items?.map((action: string, idx: number) => <li key={idx}>{action}</li>)}</ul> </div> ))} </div> </div> <div className="flex flex-col gap-3"> <Button onClick={generatePDF} variant="outline" className="w-full border-slate-300 hover:bg-slate-100"> <Download size={16} className="mr-2" /> Download Full Report (PDF) </Button> <Button onClick={handleSaveProject} className="w-full bg-slate-900 hover:bg-slate-800"> <Save size={16} className="mr-2" /> Save to My Projects </Button> </div> </div> )} </Card> </motion.div> )}
        </AnimatePresence>
      </div>
    </main>
  );
}