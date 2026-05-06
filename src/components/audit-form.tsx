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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";

// Schema for step 1
const teamSchema = z.object({
  teamSize: z.number().min(1, "Team size must be at least 1"),
  useCase: z.string().min(1, "Please select a primary use case"),
});

export function AuditForm() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
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
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-medium tracking-tight">Let's audit your AI spend</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Tell us a bit about your team to get personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={teamForm.handleSubmit(handleTeamSubmit)} className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Team Size</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5"
                      {...teamForm.register("teamSize", { valueAsNumber: true })}
                      className="bg-white/5 border-white/10 h-12 text-lg"
                    />
                    {teamForm.formState.errors.teamSize && (
                      <p className="text-red-400 text-sm">{teamForm.formState.errors.teamSize.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Primary Use Case</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {USE_CASES.map((uc) => {
                        const isSelected = teamForm.watch("useCase") === uc.id;
                        return (
                          <div
                            key={uc.id}
                            onClick={() => teamForm.setValue("useCase", uc.id as UseCase, { shouldValidate: true })}
                            className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-center justify-between ${
                              isSelected
                                ? "bg-white/10 border-white/30 text-white shadow-inner"
                                : "bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="font-medium">{uc.label}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                          </div>
                        );
                      })}
                    </div>
                    {teamForm.formState.errors.useCase && (
                      <p className="text-red-400 text-sm">{teamForm.formState.errors.useCase.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 text-lg font-medium bg-white text-black hover:bg-gray-200">
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
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-medium tracking-tight">Your AI Stack</CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                      Select the tools you're currently paying for.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground">
                    Back
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
                        className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
                          isSelected
                            ? "bg-white/10 border-white/30 shadow-inner ring-1 ring-white/20"
                            : "bg-black/20 border-white/5 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-semibold ${isSelected ? "text-white" : ""}`}>{tool.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <p className="text-xs opacity-70">{tool.description}</p>
                      </div>
                    );
                  })}
                </div>

                {store.tools.length > 0 && (
                  <Button onClick={() => setStep(3)} size="lg" className="w-full h-14 text-lg font-medium bg-white text-black hover:bg-gray-200 mt-6">
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
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-medium tracking-tight">Spend Details</CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                      Enter the details for your selected tools.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground">
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {store.tools.map((toolState) => {
                    const toolDef = AI_TOOLS.find((t) => t.id === toolState.id)!;
                    return (
                      <div key={toolDef.id} className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{toolDef.name}</h3>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => store.removeTool(toolDef.id)}>Remove</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-400">Plan</Label>
                            <Select
                              value={toolState.plan}
                              onValueChange={(val) => store.addOrUpdateTool({ ...toolState, plan: val || "" })}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {toolDef.plans.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-400">Seats / Licenses</Label>
                            <Input
                              type="number"
                              min="1"
                              value={toolState.seats}
                              onChange={(e) => store.addOrUpdateTool({ ...toolState, seats: parseInt(e.target.value) || 1 })}
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-400">Total Monthly Spend ($)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={toolState.monthlySpend}
                              onChange={(e) => store.addOrUpdateTool({ ...toolState, monthlySpend: parseInt(e.target.value) || 0 })}
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 bg-white/[0.02]">
                  <Button onClick={handleAuditSubmit} size="lg" className="w-full h-16 text-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20">
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
