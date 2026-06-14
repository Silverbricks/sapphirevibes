import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailBase, GoldButton, BASE_STYLES as C } from './base';

interface Props { firstName: string; resetUrl: string }

export function PasswordResetEmail({ firstName, resetUrl }: Props) {
  return (
    <EmailBase preview={`Reset your SapphireVibes password`}>
      <Text style={{ margin: '0 0 24px', fontSize: 22, fontFamily: 'Georgia, serif', color: C.cream, fontWeight: 400 }}>Reset your password</Text>
      <Text style={{ margin: '0 0 16px', fontSize: 14, color: C.creamDim, lineHeight: 1.7 }}>
        Hi {firstName}, we received a request to reset the password for your SapphireVibes account. Click the button below — this link expires in <b style={{ color: C.cream }}>1 hour</b>.
      </Text>
      <GoldButton href={resetUrl}>Reset password</GoldButton>
      <Text style={{ marginTop: 24, fontSize: 12, color: C.creamDim }}>
        If you didn't request this, you can safely ignore this email. Your password will not change.
      </Text>
    </EmailBase>
  );
}
