import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '.env.local') });

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey || apiKey === 'your_key_here') {
  console.error("❌ ERROR: Valid RESEND_API_KEY not found in .env.local");
  process.exit(1);
}

const resend = new Resend(apiKey);
const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error("❌ ERROR: Please provide your email as an argument. Example: node test-resend.mjs your@email.com");
  process.exit(1);
}

async function runTest() {
  console.log(`Sending test email to ${targetEmail} using onboarding@resend.dev...`);
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: targetEmail,
      subject: 'StackAudit Resend Test',
      html: '<p>If you are reading this, Resend is working perfectly!</p>'
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
    } else {
      console.log("✅ Email sent successfully! Data:", data);
      console.log("If it's not in your inbox, PLEASE CHECK YOUR SPAM/JUNK FOLDER.");
    }
  } catch (err) {
    console.error("❌ Exception thrown:", err);
  }
}

runTest();
