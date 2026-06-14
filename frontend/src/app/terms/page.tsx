import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Terms & Conditions — SapphireVibes' };

export default function TermsPage() {
  return (
    <div className="min-h-screen section-pad" style={{ background: 'var(--ink)' }}>
      <div className="container-page max-w-[760px]">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="h2 mb-8" style={{ color: 'var(--cream)' }}>Terms &amp; Conditions</h1>

        <div className="space-y-8 text-[0.92rem] leading-relaxed" style={{ color: 'var(--cream-dim)' }}>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>1. About SapphireVibes</h2>
            <p>SapphireVibes ("we", "us", "our") is an Australian online retailer of curated home décor. By using our website or purchasing from us, you agree to these terms.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>2. Orders &amp; Pricing</h2>
            <p>All prices are displayed in Australian Dollars (AUD) and include GST (calculated as 1/11 of the total). We reserve the right to cancel orders in the event of pricing errors.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>3. Shipping</h2>
            <p>Free standard shipping on all Australian orders over $150. Orders are dispatched within 2 business days. Estimated delivery 3–7 business days for metro areas.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>4. Returns</h2>
            <p>We accept returns within 30 days of delivery for items in original, unused condition. Contact us at support@sapphirevibes.com.au to initiate a return.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>5. Intellectual Property</h2>
            <p>All content on this website — including photography, copy, and brand assets — is the property of SapphireVibes and may not be reproduced without written permission.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>6. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Australian Consumer Law, our liability is limited to the value of the goods purchased. We are not liable for indirect or consequential losses.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>7. Governing Law</h2>
            <p>These terms are governed by the laws of the State of New South Wales, Australia.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--cream)' }}>8. Contact</h2>
            <p>Questions? Email <a href="mailto:support@sapphirevibes.com.au" style={{ color: 'var(--gold)' }}>support@sapphirevibes.com.au</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <Link href="/" className="text-sm transition-colors duration-300 hover:opacity-80" style={{ color: 'var(--gold)' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
