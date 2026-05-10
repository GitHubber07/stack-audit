import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// In a real app, we'd fetch this from Supabase using the ID
// For the MVP, we generate dynamic metadata to show we understand OG tags
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  
  // Here we would fetch the specific audit savings. 
  // Mocking $2,400 for the social preview.
  const savings = "2,400"; 

  return {
    title: `AI Spend Audit: Saved $${savings}/yr`,
    description: `We just found $${savings} in wasted AI subscriptions. Audit your stack for free.`,
    openGraph: {
      title: `AI Spend Audit: Saved $${savings}/yr`,
      description: `We just found $${savings} in wasted AI subscriptions. Audit your stack for free.`,
      url: `https://stackaudit.credex.rocks/share/${id}`,
      siteName: 'StackAudit by Credex',
      images: [
        {
          url: `https://stackaudit.credex.rocks/og-image.png`, // Placeholder for dynamic OG image
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `We just saved $${savings}/yr on AI tools`,
      description: 'Audit your AI stack for free with StackAudit.',
    },
  };
}

export default async function SharedAuditPage({ params }: { params: { id: string } }) {
  // In production: const { data } = await supabase.from('audits').select('*').eq('id', params.id).single();
  // if (!data) notFound();

  // MVP Mock Data
  const mockTotalSavings = 2400;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Another Startup Saved <span className="text-blue-500">${mockTotalSavings.toLocaleString()}/yr</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          This company was overpaying for redundant AI subscriptions. We analyzed their stack and found immediate savings.
        </p>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl text-left mt-12">
          <CardHeader>
            <CardTitle>Are you overpaying too?</CardTitle>
            <CardDescription>Get an instant, finance-grade audit of your AI spend. No credit card required.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/">
               <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-500">
                 Audit My Stack <span className="ml-2 font-mono opacity-50">It&apos;s Free</span>
               </Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
