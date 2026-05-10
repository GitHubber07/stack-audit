"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuditStore, UseCase } from "@/store/auditStore";
import { AI_TOOLS, USE_CASES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

// Schema for step 1
const teamSchema = z.object({
  teamSize: z.number().min(1, "Team size must be at least 1"),
  useCase: z.string().min(1, "Please select a primary use case"),
});

export function AuditForm() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const initStepParam = searchParams.get("step");
  const [step, setStep] = useState(initStepParam ? parseInt(initStepParam) : 1);
  const router = useRouter();

  const store = useAuditStore();

  const teamForm = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamSize: (store.teamSize as number) || 1,
      useCase: (store.useCase as UseCase) || undefined,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const handleTeamSubmit = (data: z.infer<typeof teamSchema>) => {
    store.setTeamSize(data.teamSize);
    store.setUseCase(data.useCase as UseCase);
    setStep(2);
  };

  const toggleTool = (toolId: string) => {
    const exists = store.tools.find((t) => t.id === toolId);
    if (exists) {
      store.removeTool(toolId);
    } else {
      store.addOrUpdateTool({
        id: toolId,
        plan: AI_TOOLS.find(t => t.id === toolId)?.plans[0].id || "",
        monthlySpend: 0,
        seats: 1,
      });
    }
  };

  const handleAuditSubmit = () => {
    if (store.tools.length === 0) {
      toast.error("Please select at least one tool to audit");
      return;
    }
    router.push("/audit"); // We will create this page next
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 perspective-1000 relative">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Let&apos;s audit your AI spend</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                  Tell us a bit about your team to get personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={teamForm.handleSubmit(handleTeamSubmit)} className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Size</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5"
                      {...teamForm.register("teamSize", { valueAsNumber: true })}
                      className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 h-12 text-lg text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50"
                    />
                    {teamForm.formState.errors.teamSize && (
                      <p className="text-red-500 text-sm">{teamForm.formState.errors.teamSize.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Use Case</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {USE_CASES.map((uc) => {
                        const isSelected = teamForm.watch("useCase") === uc.id;
                        return (
                          <div
                            key={uc.id}
                            onClick={() => teamForm.setValue("useCase", uc.id as UseCase, { shouldValidate: true })}
                            className={`cursor-pointer border rounded-xl p-4 transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-500/20 border-blue-400 dark:border-blue-500/50 text-blue-700 dark:text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-400 dark:ring-blue-500/50"
                                : "bg-white/50 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-md"
                            }`}
                          >
                            <span className="font-medium">{uc.label}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                          </div>
                        );
                      })}
                    </div>
                    {teamForm.formState.errors.useCase && (
                      <p className="text-red-500 text-sm">{teamForm.formState.errors.useCase.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all border-none">
                    Next Step <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your AI Stack</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                      Select the tools you&apos;re currently paying for.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AI_TOOLS.map((tool) => {
                    const isSelected = !!store.tools.find((t) => t.id === tool.id);
                    return (
                      <div
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`cursor-pointer border rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/20 border-blue-400 dark:border-blue-500/50 text-blue-900 dark:text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-400 dark:ring-blue-500/50"
                            : "bg-white/50 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-semibold ${isSelected ? "text-blue-800 dark:text-blue-200" : "text-gray-800 dark:text-gray-300"}`}>{tool.name}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{tool.description}</p>
                      </div>
                    );
                  })}
                </div>

                {store.tools.length > 0 && (
                  <Button onClick={() => setStep(3)} size="lg" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all border-none mt-6">
                    Configure Spend <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-white/60 dark:border-white/10 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Spend Details</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                      Enter the details for your selected tools.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200/50 dark:divide-white/5">
                  {store.tools.map((toolState) => {
                    const toolDef = AI_TOOLS.find((t) => t.id === toolState.id)!;
                    return (
                      <div key={toolDef.id} className="p-6 space-y-4 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{toolDef.name}</h3>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" onClick={() => store.removeTool(toolDef.id)}>Remove</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Plan</Label>
                            <Select
                              value={toolState.plan}
                              onValueChange={(val) => store.addOrUpdateTool({ ...toolState, plan: val || "" })}
                            >
                              <SelectTrigger className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900 dark:text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 dark:bg-zinc-900 backdrop-blur-xl border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                {toolDef.plans.map((p) => (
                                  <SelectItem key={p.id} value={p.id} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/20 focus:bg-blue-50 dark:focus:bg-blue-500/20">
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Seats / Licenses</Label>
                            <Input
                              type="number"
                              min="1"
                              value={toolState.seats}
                              onChange={(e) => store.addOrUpdateTool({ ...toolState, seats: e.target.value === "" ? "" : parseInt(e.target.value) })}
                              className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm text-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Monthly Spend ($)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={toolState.monthlySpend}
                              onChange={(e) => store.addOrUpdateTool({ ...toolState, monthlySpend: e.target.value === "" ? "" : parseInt(e.target.value) })}
                              className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 bg-gradient-to-b from-white/10 dark:from-transparent to-white/30 dark:to-white/5 border-t border-gray-200/50 dark:border-white/5">
                  <Button onClick={handleAuditSubmit} size="lg" className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-none">
                    Generate Audit Report <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
