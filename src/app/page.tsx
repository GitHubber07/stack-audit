import { Suspense } from "react";
import { AuditForm } from "@/components/audit-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 w-full min-h-screen relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto text-center space-y-6 mb-12 relative z-10">
        <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-sm px-4 py-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-black/60 transition-colors">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          Average saving found: $2,400/yr
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm pb-2">
          Stop overpaying for AI tools.
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Startups waste thousands annually on redundant AI subscriptions, wrong tiers, and underutilized seats. Get a free, instant audit of your stack.
        </p>
      </div>

      <div className="w-full relative z-10">
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Loading...</div>}>
          <AuditForm />
        </Suspense>
      </div>

      <div className="mt-24 text-center space-y-8 relative z-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder logos for social proof */}
          <div className="text-2xl font-black font-sans text-gray-900 dark:text-gray-100 tracking-tighter">ACME Corp</div>
          <div className="text-2xl font-black font-sans text-blue-900 dark:text-blue-200 tracking-tighter">Globex</div>
          <div className="text-2xl font-black font-sans text-indigo-900 dark:text-indigo-200 tracking-tighter">Soylent</div>
          <div className="text-2xl font-black font-sans text-violet-900 dark:text-violet-200 tracking-tighter">Initech</div>
        </div>
      </div>
    </main>
  );
}
