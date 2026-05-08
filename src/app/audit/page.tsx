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
import { Loader2, ArrowRight, CheckCircle2, AlertTriangle, Share2 } from "lucide-react";
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
    <div className="w-full max-w-5xl mx-auto py-12 px-6 space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-5xl font-bold tracking-tight">Your Audit Results</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <Card className="bg-white/5 border-white/10 w-full md:w-64">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-2">Total Monthly Savings</p>
              <p className="text-4xl font-bold text-white">${result.totalMonthlySavings.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-600/20 border-blue-500/30 w-full md:w-64">
            <CardContent className="p-6">
              <p className="text-sm text-blue-300 uppercase tracking-widest font-semibold mb-2">Total Annual Savings</p>
              <p className="text-4xl font-bold text-blue-400">${result.totalAnnualSavings.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>AI Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-gray-300">{summary}</p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mt-12 mb-6">Line-item Recommendations</h2>
          <div className="space-y-4">
            {result.recommendations.map((rec) => (
              <Card key={rec.toolId} className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
                <div className={`h-1 w-full ${rec.recommendedAction === 'KEEP' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{rec.toolName}</h3>
                        <Badge variant={rec.recommendedAction === 'KEEP' ? 'outline' : 'default'} className={rec.recommendedAction === 'KEEP' ? 'border-green-500/30 text-green-400' : 'bg-blue-600'}>
                          {rec.recommendedAction}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{rec.reasoning}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-sm text-muted-foreground">Current: ${rec.currentSpend}/mo</p>
                      {rec.savingsMonthly > 0 && (
                        <p className="text-lg font-bold text-green-400">Save ${rec.savingsMonthly}/mo</p>
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
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl sticky top-6">
            <CardHeader>
              <CardTitle>
                {result.isHighSavings ? "Unlock These Savings" : "Stay Optimized"}
              </CardTitle>
              <CardDescription>
                {result.isHighSavings 
                  ? "You have over $500/mo in savings potential. Credex can handle the vendor negotiations and migrations for you." 
                  : "You're spending well. Enter your email to save this report and get notified when new AI pricing drops."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isLeadCaptured ? (
                <form onSubmit={handleCaptureLead} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="founder@startup.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5"
                    />
                  </div>
                  <Button disabled={submittingLead} type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                    {submittingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Report"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                  <p className="font-medium text-lg">Report sent to your email.</p>
                  {result.isHighSavings && (
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-500">
                      Book Credex Consultation
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={shareAudit} variant="outline" className="w-full border-white/10 hover:bg-white/5">
            <Share2 className="w-4 h-4 mr-2" /> Share Public Report
          </Button>
        </div>
      </div>
    </div>
  );
}
