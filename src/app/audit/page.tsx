"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuditStore } from "@/store/auditStore";
import { generateAudit, AuditResult } from "@/lib/auditEngine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, CheckCircle2, AlertTriangle, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AuditResults() {
  const router = useRouter();
  const store = useAuditStore();
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [email, setEmail] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (store.tools.length === 0) {
      router.push("/");
      return;
    }

    const auditRes = generateAudit({
      teamSize: store.teamSize,
      useCase: store.useCase,
      tools: store.tools,
    });
    setResult(auditRes);

    // Fetch AI Summary
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamSize: store.teamSize,
        useCase: store.useCase,
        auditData: auditRes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setLoadingSummary(false);
      })
      .catch(() => {
        setSummary("Your audit is complete. Please review the breakdown below.");
        setLoadingSummary(false);
      });
  }, [router, store]);

  if (!mounted || !result) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmittingLead(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          auditResult: result,
          tools: store.tools
        }),
      });

      if (res.ok) {
        setIsLeadCaptured(true);
        toast.success("Report saved! Check your email.");
      } else {
        toast.error("Something went wrong saving your report.");
      }
    } catch (err) {
      toast.error("Failed to save report.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const shareAudit = () => {
    // In a real app, this creates a record in the DB and returns the ID.
    // For this prototype MVP, we mock it.
    const shareUrl = `${window.location.origin}/share/demo-123`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6 space-y-8 min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative z-10"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-left bg-gradient-to-br from-blue-700 via-violet-700 to-indigo-700 dark:from-blue-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm pb-1">Your Audit Results</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-left font-medium">Here is your custom AI stack analysis.</p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/?step=3")} className="text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-start gap-6 mt-8">
          <Card className="bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 w-full md:w-64 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl hover:scale-[1.03] transition-transform duration-300">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-2">Total Monthly Savings</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">${result.totalMonthlySavings.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 w-full md:w-64 shadow-[0_10px_40px_rgba(59,130,246,0.15)] dark:shadow-[0_10px_40px_rgba(59,130,246,0.05)] hover:scale-[1.03] transition-transform duration-300 ring-1 ring-blue-100 dark:ring-blue-900/30">
            <CardContent className="p-6">
              <p className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-2">Total Annual Savings</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">${result.totalAnnualSavings.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white font-bold text-2xl">AI Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium">{summary}</p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-3xl font-extrabold mt-12 mb-6 text-gray-900 dark:text-white tracking-tight">Line-item Recommendations</h2>
          <div className="space-y-4">
            {result.recommendations.map((rec) => (
              <Card key={rec.toolId} className="bg-white/80 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-xl hover:shadow-[0_15px_40px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_15px_40px_rgb(0,0,0,0.4)] hover:scale-[1.01] transition-all duration-300">
                <div className={`h-1.5 w-full ${rec.recommendedAction === 'KEEP' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-violet-500'}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{rec.toolName}</h3>
                        <Badge variant={rec.recommendedAction === 'KEEP' ? 'outline' : 'default'} className={rec.recommendedAction === 'KEEP' ? 'border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold shadow-sm' : 'bg-blue-600 dark:bg-blue-600 text-white font-bold shadow-sm'}>
                          {rec.recommendedAction}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">{rec.reasoning}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Current: ${rec.currentSpend}/mo</p>
                      {rec.savingsMonthly > 0 && (
                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">Save ${rec.savingsMonthly}/mo</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Lead Capture / CTA */}
        <div className="space-y-6">
          <Card className="bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl sticky top-6">
            <CardHeader className="bg-gradient-to-b from-blue-50/50 dark:from-blue-900/10 to-transparent border-b border-gray-100/50 dark:border-white/5">
              <CardTitle className="text-gray-900 dark:text-white font-bold">
                {result.isHighSavings ? "Unlock These Savings" : "Stay Optimized"}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 font-medium">
                {result.isHighSavings 
                  ? "You have over $500/mo in savings potential. Credex can handle the vendor negotiations and migrations for you." 
                  : "You're spending well. Enter your email to save this report and get notified when new AI pricing drops."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!isLeadCaptured ? (
                <form onSubmit={handleCaptureLead} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-bold">Work Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="founder@startup.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/80 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <Button disabled={submittingLead} type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                    {submittingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Report"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto drop-shadow-sm" />
                  <p className="font-extrabold text-xl text-gray-900 dark:text-white">Report sent to your email.</p>
                  {result.isHighSavings && (
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-all font-bold">
                      Book Credex Consultation
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={shareAudit} variant="outline" className="w-full border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60 text-gray-700 dark:text-gray-300 font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <Share2 className="w-4 h-4 mr-2" /> Share Public Report
          </Button>
        </div>
      </div>
    </div>
  );
}
