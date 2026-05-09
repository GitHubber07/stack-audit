import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase (requires SUPABASE_URL and SUPABASE_ANON_KEY env vars)
const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(req: NextRequest) {
  try {
    const { email, auditResult, tools } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic abuse protection: Rate limiting would normally happen here at the Edge (e.g. Upstash Redis)
    // For MVP, we assume Vercel Edge protection is active.

    // 1. Store in Supabase
    // If keys are dummy, we skip actual insert to avoid crashing the build/demo
    let shareId = "demo-" + Math.random().toString(36).substring(7);
    
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('dummy')) {
      const { data, error } = await supabase
        .from('audits')
        .insert([
          { 
            email, 
            total_savings: auditResult.totalAnnualSavings,
            audit_data: auditResult,
            tools_data: tools 
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error("Supabase insert error:", error);
      } else if (data) {
        shareId = data.id;
      }
    }

    // 2. Send transactional email via Resend
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('dummy')) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'onboarding@resend.dev', // Must use this for testing unverified domains
          to: email,
          subject: `Your AI Stack Audit Results: Save $${auditResult.totalAnnualSavings.toLocaleString()}/yr`,
          html: `
            <h1>StackAudit Results</h1>
            <p>Hi there,</p>
            <p>We found <strong>$${auditResult.totalAnnualSavings.toLocaleString()}</strong> in potential annual savings for your AI tool stack.</p>
            ${auditResult.isHighSavings ? '<p>Because your savings potential is significant, our team at Credex can help you negotiate better rates and migrate seamlessly. <a href="https://credex.rocks/consultation">Book a free consultation.</a></p>' : '<p>Your stack is looking pretty efficient. We will notify you if new pricing models drop.</p>'}
            <p>You can view your full interactive report here: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/share/${shareId}">View Report</a></p>
            <p>Best,<br>The Credex Team</p>
          `
        });
        
        if (error) {
          console.error("Resend API rejected the email:", error);
        } else {
          console.log("Resend API Email Sent Successfully!", data);
        }
      } catch (emailError) {
        console.error("Resend API caught exception:", emailError);
      }
    } else {
      console.log("Skipping email: RESEND_API_KEY not found or is dummy.");
    }

    return NextResponse.json({ success: true, shareId });

  } catch (error) {
    console.error("Lead Capture Error:", error);
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}
