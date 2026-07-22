'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  Search,
  Calculator,
  Download,
  ChevronDown,
  Link2,
  Briefcase,
  Wallet,
  Save,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Premium button class to ensure perfect text wrapping and height adjustment
const btnClass =
  'w-full bg-slate-900 hover:bg-slate-800 h-auto py-3.5 text-base whitespace-normal break-words transition-colors duration-200';

export default function DashboardClient({ email }: { email: string }) {
  const { isSignedIn } = useUser();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [nicheResult, setNicheResult] = useState<any>(null);
  const [seoResult, setSeoResult] = useState<any>(null);
  const [roasResult, setRoasResult] = useState<any>(null);
  const [bizResult, setBizResult] = useState<any>(null);
  const [budgetResult, setBudgetResult] = useState<any>(null);
  const [platform, setPlatform] = useState('Meta Ads');
  const [showNicheAdvanced, setShowNicheAdvanced] = useState(false);
  const [showSeoAdvanced, setShowSeoAdvanced] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const callEngine = async (stepNum: number, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNum, data: payload })
      });
      const data = await res.json();

      // Catch Guest Limit
      if (data.error === 'GUEST_LIMIT_REACHED') {
        toast.error(data.message);
        setShowSignInModal(true);
        setLoading(false);
        return;
      }

      if (stepNum === 1) {
        setNicheResult(data);
        setShowNicheAdvanced(false);
      }
      if (stepNum === 2) {
        setSeoResult(data);
        setShowSeoAdvanced(false);
      }
      if (stepNum === 3) setRoasResult(data);
      if (stepNum === 4) setBizResult(data);
      if (stepNum === 5) setBudgetResult(data);
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    if (!product) return;
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const res = await fetch('/api/suggest-audience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      const data = await res.json();
      if (data.audiences) setSuggestions(data.audiences);
    } catch (e) {
      console.error(e);
    }
    setLoadingSuggestions(false);
  };

  const handleSaveProject = async () => {
    const reportData = {
      niche: nicheResult,
      seo: seoResult,
      roas: roasResult,
      business: bizResult,
      budget: budgetResult,
      platform,
      product,
      audience
    };
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${product} - ${audience}`, reportData })
      });
      const data = await res.json();

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
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Awsaf Hub - Business Report', 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Product: ${product} | Target: ${audience}`, 20, 28);
    let y = 50;
    const addSectionTitle = (title: string) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text(title, 20, y);
      y += 7;
    };
    const addLabelAndText = (
      label: string,
      text: string,
      color: [number, number, number] = [51, 65, 85]
    ) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`${label}:`, 20, y);
      y += 5;
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text || 'N/A', 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 4;
    };
    const addBulletList = (label: string, items: string[], color: number[] = [51, 65, 85]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`${label}:`, 20, y);
      y += 5;
      doc.setTextColor(color[0], color[1], color[2]);
      items.forEach((item) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        const lines = doc.splitTextToSize(`• ${item}`, 165);
        doc.text(lines, 25, y);
        y += lines.length * 5;
      });
      y += 4;
    };

    addSectionTitle('1. Niche & Market Route');
    addLabelAndText('Best Route', nicheResult?.best_route);
    addLabelAndText('Persona', nicheResult?.audience_persona);
    addBulletList('Marketing Angles', nicheResult?.marketing_angles || []);
    if (nicheResult?.channels_to_check)
      addBulletList('Leads & Channels', nicheResult.channels_to_check, [37, 99, 235]);
    addSectionTitle('2. SEO Strategy');
    addBulletList('Primary Keywords', seoResult?.primary_keywords || []);
    addLabelAndText('Content Strategy', seoResult?.content_strategy);
    addLabelAndText('Expected Timeline', seoResult?.expected_timeline, [22, 163, 74]);
    if (seoResult?.blog_titles) addBulletList('Blog Titles', seoResult.blog_titles, [37, 99, 235]);
    if (seoResult?.landing_page_titles)
      addBulletList('Landing Page Titles', seoResult.landing_page_titles, [37, 99, 235]);
    addSectionTitle('3. ROAS Projections');
    addLabelAndText('Ad Platform', platform);
    addLabelAndText('Expected ROAS', roasResult?.expected_roas, [22, 163, 74]);
    addLabelAndText('Expected CPA', roasResult?.expected_cpa);
    addLabelAndText('Justification', roasResult?.justification);
    if (bizResult) {
      addSectionTitle('4. Market Analysis');
      addLabelAndText('Market Size', bizResult.market_size);
      addBulletList('Market Trends', bizResult.market_trends || []);
      addBulletList('Market Challenges', bizResult.market_challenges || [], [185, 28, 28]);
      doc.addPage();
      y = 20;
      addSectionTitle('5. Competitor Analysis');
      if (bizResult.top_competitors) {
        bizResult.top_competitors.forEach((comp: any, i: number) => {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text(`Competitor ${i + 1}: ${comp.name}`, 20, y);
          y += 6;
          addLabelAndText('Strengths', comp.strengths, [22, 101, 52]);
          addLabelAndText('Weaknesses', comp.weaknesses, [185, 28, 28]);
          y += 2;
        });
      }
    }
    if (budgetResult) {
      doc.addPage();
      y = 20;
      addSectionTitle('6. Budget & Launch Roadmap');
      addLabelAndText(
        'Estimated Budget Range',
        `${budgetResult.total_min_budget || 'N/A'} - ${budgetResult.total_max_budget || 'N/A'}`,
        [15, 23, 42]
      );
      if (budgetResult.budget_breakdown) {
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text('Budget Breakdown:', 20, y);
        y += 6;
        budgetResult.budget_breakdown.forEach((item: any) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(`- ${item.category}: ${item.min_cost} - ${item.max_cost}`, 20, y);
          y += 5;
        });
        y += 5;
      }
      if (budgetResult.launch_phases) {
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text('Launch Phases:', 20, y);
        y += 6;
        budgetResult.launch_phases.forEach((phase: any) => {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(phase.phase_name, 20, y);
          y += 5;
          phase.action_items.forEach((action: string) => {
            if (y > 275) {
              doc.addPage();
              y = 20;
            }
            doc.setTextColor(100, 116, 139);
            const lines = doc.splitTextToSize(`• ${action}`, 165);
            doc.text(lines, 25, y);
            y += lines.length * 5;
          });
          y += 4;
        });
      }
    }
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Powered by AWSAFTRADING LLC', 20, 290);
    }
    doc.save(`Awsaf_Business_Report_${product.replace(/\s/g, '_')}.pdf`);
  };

  const steps = ['Niche', 'SEO', 'ROAS', 'Market', 'Budget'];

  return (
    <main className="relative flex flex-1 flex-col items-center p-4 md:p-8">
      {/* GUEST LIMIT SIGN-IN MODAL */}
      {showSignInModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowSignInModal(false)}
        >
          <div
            className="max-w-sm rounded-xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Free Limit Reached</h2>
            <p className="mb-6 text-slate-500">
              You've used your 5 free AI analyses. Sign up for free to keep generating reports and
              download your PDF.
            </p>
            <SignInButton mode="modal">
              <Button className="h-auto w-full bg-slate-900 py-3 hover:bg-slate-800">
                Sign In / Sign Up
              </Button>
            </SignInButton>
            <Button
              variant="ghost"
              className="mt-2 text-slate-400"
              onClick={() => setShowSignInModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Premium Stepper */}
      <div className="mb-12 flex w-full max-w-2xl items-center justify-between">
        {steps.map((label, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${step >= i + 1 ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-400'}`}
            >
              {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span
              className={`hidden text-xs font-medium md:block ${step >= i + 1 ? 'text-slate-900' : 'text-slate-400'}`}
            >
              {label}
            </span>
            {i < 4 && (
              <div
                className={`h-0.5 flex-1 transition-colors duration-300 ${step > i + 1 ? 'bg-slate-900' : 'bg-slate-200'}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border-slate-200 p-8 shadow-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-900">
                    <Globe size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Step 1: Niche Finder</h2>
                </div>
                <div className="mb-6 space-y-4">
                  <div>
                    <Label htmlFor="product" className="text-slate-600">
                      Product Details
                    </Label>
                    <Input
                      id="product"
                      placeholder="e.g. Organic Matcha Green Tea"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="mt-1 border-slate-200 focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audience" className="text-slate-600">
                      Focus Group / Country
                    </Label>
                    <Input
                      id="audience"
                      placeholder="e.g. Fitness enthusiasts in USA"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="mt-1 border-slate-200 focus:border-slate-900"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSuggestions}
                      disabled={loadingSuggestions || !product}
                      className="mt-2 border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                      {loadingSuggestions ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" /> Thinking...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="mr-2" /> Get AI Suggestions
                        </>
                      )}
                    </Button>
                    {suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs font-medium text-slate-400">
                          AI suggested audiences:
                        </span>
                        {suggestions.map((grp) => (
                          <button
                            key={grp}
                            type="button"
                            onClick={() => setAudience(grp)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
                          >
                            {grp}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => callEngine(1, { product, audience })}
                  disabled={loading || !product || !audience || !!nicheResult}
                  className={btnClass}
                >
                  {nicheResult ? (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Generated
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Analyzing Market...
                    </>
                  ) : (
                    'Find My Marketing Route'
                  )}
                </Button>
                {nicheResult && (
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                    <p className="mb-1 text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Best Route:
                    </p>
                    <p className="mb-4 text-xl font-bold text-slate-900">
                      {nicheResult.best_route}
                    </p>
                    <p className="mb-1 text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Persona:
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">
                      {nicheResult.audience_persona}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNicheAdvanced(!showNicheAdvanced)}
                      className="mb-4 w-full border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                      <Link2 size={14} className="mr-2" /> {showNicheAdvanced ? 'Hide' : 'Show'}{' '}
                      Advanced{' '}
                      <ChevronDown
                        size={14}
                        className={`ml-2 transition-transform ${showNicheAdvanced ? 'rotate-180' : ''}`}
                      />
                    </Button>
                    <AnimatePresence>
                      {showNicheAdvanced && nicheResult.channels_to_check && (
                        <motion.ul
                          className="mb-4 list-inside list-disc space-y-1 text-sm text-slate-600"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {nicheResult.channels_to_check.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                    <Button
                      onClick={() => setStep(2)}
                      className="h-auto w-full bg-slate-900 py-3 hover:bg-slate-800"
                    >
                      I'm pleased. Plan my SEO <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border-slate-200 p-8 shadow-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-900">
                    <Search size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Step 2: SEO Planner</h2>
                </div>
                <p className="mb-4 text-sm text-slate-500">
                  Based on your route:{' '}
                  <span className="font-bold text-slate-900">{nicheResult?.best_route}</span>
                </p>
                <Button
                  onClick={() =>
                    callEngine(2, { product, audience, best_route: nicheResult.best_route })
                  }
                  disabled={loading || !!seoResult}
                  className={btnClass}
                >
                  {seoResult ? (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Generated
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Researching Keywords...
                    </>
                  ) : (
                    'Generate SEO Plan'
                  )}
                </Button>
                {seoResult && (
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {seoResult.primary_keywords?.map((k: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-800"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <p className="mb-1 text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Content Strategy:
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">
                      {seoResult.content_strategy}
                    </p>
                    <p className="mb-1 text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Timeline:
                    </p>
                    <p className="mb-4 text-sm font-bold text-slate-900">
                      {seoResult.expected_timeline}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSeoAdvanced(!showSeoAdvanced)}
                      className="mb-4 w-full border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                      <Link2 size={14} className="mr-2" /> {showSeoAdvanced ? 'Hide' : 'Show'} Title
                      Examples{' '}
                      <ChevronDown
                        size={14}
                        className={`ml-2 transition-transform ${showSeoAdvanced ? 'rotate-180' : ''}`}
                      />
                    </Button>
                    <AnimatePresence>
                      {showSeoAdvanced && (
                        <motion.div
                          className="mb-4 space-y-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div>
                            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                              Blog Titles:
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                              {seoResult.blog_titles?.map((t: string, i: number) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                              Landing Page Titles:
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                              {seoResult.landing_page_titles?.map((t: string, i: number) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      onClick={() => setStep(3)}
                      className="h-auto w-full bg-slate-900 py-3 hover:bg-slate-800"
                    >
                      Calculate my ROAS <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border-slate-200 p-8 shadow-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-900">
                    <Calculator size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Step 3: ROAS Calculator</h2>
                </div>
                <div className="mb-6">
                  <Label htmlFor="platform" className="text-slate-600">
                    Ad Platform
                  </Label>
                  <select
                    id="platform"
                    className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option>Meta Ads (Facebook/IG)</option>
                    <option>TikTok Ads</option>
                    <option>Google Ads (Search/PMAX)</option>
                    <option>LinkedIn Ads</option>
                    <option>YouTube Ads</option>
                  </select>
                </div>
                <Button
                  onClick={() =>
                    callEngine(3, {
                      product,
                      audience,
                      platform,
                      keywords: seoResult.primary_keywords?.join(', ')
                    })
                  }
                  disabled={loading || !!roasResult}
                  className={btnClass}
                >
                  {roasResult ? (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Generated
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Calculating Projections...
                    </>
                  ) : (
                    'Calculate Expected ROAS'
                  )}
                </Button>
                {roasResult && (
                  <div className="mt-6 rounded-xl bg-slate-900 p-6 text-center shadow-lg">
                    <p className="mb-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
                      Expected ROAS
                    </p>
                    <p className="mb-4 text-5xl font-bold text-emerald-400">
                      {roasResult.expected_roas}
                    </p>
                    <p className="mb-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
                      Expected CPA
                    </p>
                    <p className="mb-4 text-xl font-bold text-white">{roasResult.expected_cpa}</p>
                    <p className="mt-4 text-xs text-slate-300 italic">
                      "{roasResult.justification}"
                    </p>
                    <Button
                      onClick={() => setStep(4)}
                      className="mt-6 h-auto w-full bg-white py-3 text-slate-900 hover:bg-slate-200"
                    >
                      Analyze Market & Competitors <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border-slate-200 p-8 shadow-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-900">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Step 4: Business Analysis</h2>
                </div>
                <Button
                  onClick={() => callEngine(4, { product, audience })}
                  disabled={loading || !!bizResult}
                  className={btnClass}
                >
                  {bizResult ? (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Generated
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Analyzing Competitors...
                    </>
                  ) : (
                    'Generate Market & Competitor Analysis'
                  )}
                </Button>
                {bizResult && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                      <h3 className="mb-3 text-sm font-bold tracking-wider text-slate-900 uppercase">
                        Market Analysis
                      </h3>
                      <p className="mb-1 text-xs text-slate-500">Market Size:</p>
                      <p className="mb-4 text-sm font-bold text-slate-900">
                        {bizResult.market_size}
                      </p>
                      <p className="mb-1 text-xs text-slate-500">Trends:</p>
                      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-slate-700">
                        {bizResult.market_trends?.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                      <p className="mb-1 text-xs text-slate-500">Challenges:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-rose-600">
                        {bizResult.market_challenges?.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase">
                        Top Competitors
                      </h3>
                      <div className="space-y-4">
                        {bizResult.top_competitors?.map((comp: any, i: number) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                          >
                            <p className="text-md mb-2 font-bold text-slate-900">{comp.name}</p>
                            <p className="text-xs font-medium text-emerald-700">
                              <span className="font-bold">Strengths:</span> {comp.strengths}
                            </p>
                            <p className="mt-1 text-xs font-medium text-rose-700">
                              <span className="font-bold">Weaknesses:</span> {comp.weaknesses}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(5)}
                      className="h-auto w-full bg-slate-900 py-3 hover:bg-slate-800"
                    >
                      Plan my Budget & Launch <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-2xl border-slate-200 p-8 shadow-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-900">
                    <Wallet size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Step 5: Budget & Launch Roadmap
                  </h2>
                </div>
                <Button
                  onClick={() =>
                    callEngine(5, {
                      product,
                      audience,
                      platform,
                      roas: roasResult?.expected_roas,
                      cpa: roasResult?.expected_cpa
                    })
                  }
                  disabled={loading || !!budgetResult}
                  className={btnClass}
                >
                  {budgetResult ? (
                    <>
                      <CheckCircle2 size={18} className="mr-2" /> Generated
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Planning Launch...
                    </>
                  ) : (
                    'Generate Budget & Roadmap'
                  )}
                </Button>
                {budgetResult && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-xl bg-slate-900 p-6 shadow-lg">
                      <h3 className="mb-3 text-sm font-bold tracking-wider text-white uppercase">
                        Accurate Budget Analysis
                      </h3>
                      <p className="mb-1 text-xs text-slate-400">Estimated Total Budget Range:</p>
                      <p className="mb-4 text-xl font-bold text-white">
                        {budgetResult.total_min_budget} - {budgetResult.total_max_budget}
                      </p>
                      <div className="space-y-2">
                        {budgetResult.budget_breakdown?.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg bg-slate-800 p-2"
                          >
                            <span className="text-sm text-slate-300">{item.category}</span>
                            <span className="text-sm font-bold text-white">
                              {item.min_cost} - {item.max_cost}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase">
                        Zero to Launch Roadmap
                      </h3>
                      <div className="space-y-4">
                        {budgetResult.launch_phases?.map((phase: any, i: number) => (
                          <div key={i} className="border-l-2 border-slate-900 pl-4">
                            <p className="text-md font-bold text-slate-900">{phase.phase_name}</p>
                            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-600">
                              {phase.action_items?.map((action: string, idx: number) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GATED SAVE / DOWNLOAD BUTTONS */}
                    {isSignedIn ? (
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={generatePDF}
                          variant="outline"
                          className="h-auto w-full border-slate-300 py-3.5 text-base break-words whitespace-normal hover:bg-slate-100"
                        >
                          <Download size={16} className="mr-2" /> Download Full Report (PDF)
                        </Button>
                        <Button
                          onClick={handleSaveProject}
                          className="h-auto w-full bg-slate-900 py-3.5 text-base break-words whitespace-normal hover:bg-slate-800"
                        >
                          <Save size={16} className="mr-2" /> Save to My Projects
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-slate-900 p-6 text-center text-white">
                        <h3 className="mb-2 text-lg font-bold">
                          Create a free account to save your work
                        </h3>
                        <p className="mb-4 text-sm text-slate-400">
                          Sign in to download this PDF report and save it to your dashboard.
                        </p>
                        <SignInButton mode="modal">
                          <Button className="h-auto w-full bg-white py-3 text-slate-900 hover:bg-slate-200">
                            Sign In / Sign Up Free
                          </Button>
                        </SignInButton>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
