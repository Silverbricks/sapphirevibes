import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Hr } from '@react-email/components';

const BASE = {
  bg: '#0e1116',
  surface: '#151a22',
  gold: '#c8a45c',
  goldBright: '#e4c884',
  cream: '#f4efe6',
  creamDim: '#bfb8a9',
  line: 'rgba(200,164,92,0.22)',
};

export function EmailBase({ children, preview }: { children: React.ReactNode; preview?: string }) {
  return (
    <Html lang="en">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');`}</style>
      </Head>
      <Body style={{ backgroundColor: BASE.bg, margin: 0, fontFamily: 'Jost, Helvetica, sans-serif' }}>
        {preview && <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{preview}</div>}
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: BASE.surface, border: `1px solid ${BASE.line}` }}>
          {/* Header */}
          <Section style={{ padding: '24px 32px', borderBottom: `1px solid ${BASE.line}` }}>
            <Text style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 22, color: BASE.cream, letterSpacing: 1 }}>
              Sapphire<span style={{ color: BASE.gold }}>Vibes</span>
            </Text>
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px 32px 24px' }}>{children}</Section>
          {/* Footer */}
          <Hr style={{ borderColor: BASE.line, margin: 0 }} />
          <Section style={{ padding: '18px 32px' }}>
            <Text style={{ margin: 0, fontSize: 11, color: BASE.creamDim, letterSpacing: 1 }}>
              SapphireVibes · Australian owned &amp; operated · ABN 00 000 000 000
            </Text>
            <Text style={{ margin: '4px 0 0', fontSize: 10, color: BASE.creamDim }}>
              GST-inclusive pricing · PCI DSS compliant · Unsubscribe at any time
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const BASE_STYLES = BASE;

export function GoldButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', backgroundColor: BASE.gold, color: BASE.bg, textDecoration: 'none', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
      {children}
    </a>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: BASE.gold }}>{children}</Text>;
}
