import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy Policy — SapphireVibes' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen section-pad" style={{ background: 'var(--ink)' }}>
      <div className="container-page max-w-[760px]">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="h2 mb-8" style={{ color: 'var(--cream)' }}>Privacy Policy</h1>

        <div className="space-y-8 text-[0.92rem] leading-relaxed" style={{ color: 'var(--cream-dim)' }}>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>1. What we collect</h2>
            <p>We collect information you provide directly (name, email, address, payment details) and usage data (pages visited, products viewed) via cookies and analytics tools.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>2. How we use it</h2>
            <p>Your data is used to process orders, send order updates, personalise recommendations, and — with your consent — send marketing emails. We never sell your data.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>3. Third parties</h2>
            <p>We share data with: Stripe (payments), SendGrid (email), and Google Analytics (usage). Each operates under their own privacy policy and we share only what is necessary.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>4. Cookies</h2>
            <p>We use essential cookies for cart/session functionality and optional analytics cookies. You can disable non-essential cookies in your browser settings.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>5. Your rights</h2>
            <p>Under the Australian Privacy Act, you have the right to access, correct, or delete your personal information. Email us at <a href="mailto:privacy@sapphirevibes.com.au" style={{ color: 'var(--gold)' }}>privacy@sapphirevibes.com.au</a>.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>6. Data security</h2>
            <p>Payment data is processed by Stripe and never stored on our servers. Account passwords are hashed using bcrypt. Our servers use TLS encryption in transit.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>7. Updates</h2>
            <p>We may update this policy from time to time. Material changes will be communicated by email or a notice on this page.</p>
          </section>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <Link href="/" className="text-sm transition-colors duration-300 hover:opacity-80" style={{ color: 'var(--gold)' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
