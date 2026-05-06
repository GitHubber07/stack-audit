import { AuditForm } from "@/components/audit-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 w-full">
      <div className="w-full max-w-4xl mx-auto text-center space-y-6 mb-12">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
          Average saving found: $2,400/yr
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
          Stop overpaying for AI tools.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Startups waste thousands annually on redundant AI subscriptions, wrong tiers, and underutilized seats. Get a free, instant audit of your stack.
        </p>
      </div>

      <div className="w-full relative z-10">
        {/* Glow effect behind the form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 blur-[120px] -z-10 rounded-full" />
        <AuditForm />
      </div>

      <div className="mt-24 text-center space-y-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          {/* Placeholder logos for social proof */}
          <div className="text-xl font-bold font-mono">ACME Corp</div>
          <div className="text-xl font-bold font-mono">Globex</div>
          <div className="text-xl font-bold font-mono">Soylent</div>
          <div className="text-xl font-bold font-mono">Initech</div>
        </div>
      </div>
    </main>
  );
}
