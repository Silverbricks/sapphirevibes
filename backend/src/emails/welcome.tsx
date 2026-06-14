import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { EmailBase, GoldButton, BASE_STYLES as C } from './base';

interface Props { firstName: string; frontendUrl: string; referralCode: string }

export function WelcomeEmail({ firstName, frontendUrl, referralCode }: Props) {
  return (
    <EmailBase preview={`Welcome to SapphireVibes, ${firstName} — 200 reward points are yours`}>
      <Text style={{ margin: '0 0 24px', fontSize: 26, fontFamily: 'Georgia, serif', color: C.cream, fontWeight: 400, lineHeight: 1.2 }}>
        Welcome to SapphireVibes,<br />{firstName}.
      </Text>
      <Text style={{ margin: '0 0 16px', fontSize: 14, color: C.creamDim, lineHeight: 1.7 }}>
        You've joined a community of considered Australian homes. To celebrate, <b style={{ color: C.goldBright }}>200 reward points</b> ($2.00 value) have been added to your account.
      </Text>
      <Section style={{ margin: '20px 0', padding: '18px 20px', backgroundColor: 'rgba(200,164,92,.08)', border: `1px solid rgba(200,164,92,.22)` }}>
        <Text style={{ margin: '0 0 4px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.gold }}>Your referral code</Text>
        <Text style={{ margin: 0, fontSize: 22, fontFamily: 'Georgia, serif', color: C.cream, letterSpacing: 4 }}>{referralCode}</Text>
        <Text style={{ margin: '8px 0 0', fontSize: 12, color: C.creamDim }}>Share with friends — they get 200 pts, you earn 500 pts per referral.</Text>
      </Section>
      <GoldButton href={frontendUrl}>Start shopping →</GoldButton>
    </EmailBase>
  );
}
