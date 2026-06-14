import * as React from 'react';
import { Text, Row, Column, Hr } from '@react-email/components';
import { EmailBase, GoldButton, BASE_STYLES as C } from './base';

interface CartItem { name: string; price: number; quantity: number }

interface Props { firstName: string; items: CartItem[]; subtotal: number; discountCode: string; cartUrl: string }

export function AbandonedCartEmail({ firstName, items, subtotal, discountCode, cartUrl }: Props) {
  return (
    <EmailBase preview={`${firstName}, you left something behind`}>
      <Text style={{ margin: '0 0 24px', fontSize: 22, fontFamily: 'Georgia, serif', color: C.cream, fontWeight: 400 }}>
        You left something<br />beautiful behind
      </Text>
      <Text style={{ margin: '0 0 20px', fontSize: 14, color: C.creamDim, lineHeight: 1.7 }}>
        Hi {firstName}, your cart is waiting. Come back and complete your order — we've reserved your items.
      </Text>
      <Hr style={{ borderColor: C.line, margin: '0 0 16px' }} />
      {items.map((item, i) => (
        <Row key={i} style={{ marginBottom: 8 }}>
          <Column><Text style={{ margin: 0, fontSize: 13, color: C.cream }}>{item.name}</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: 13, color: C.creamDim }}>×{item.quantity} · ${(item.price * item.quantity).toFixed(2)}</Text></Column>
        </Row>
      ))}
      <Hr style={{ borderColor: C.line, margin: '16px 0' }} />
      <Row>
        <Column><Text style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.cream }}>Subtotal</Text></Column>
        <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: 14, color: C.goldBright, fontWeight: 600 }}>${subtotal.toFixed(2)} AUD</Text></Column>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Column>
          <Text style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.gold }}>Exclusive offer</Text>
          <Text style={{ margin: 0, fontSize: 13, color: C.creamDim }}>Use code <b style={{ color: C.cream, letterSpacing: 2 }}>{discountCode}</b> for <b style={{ color: C.goldBright }}>10% off</b> your order.</Text>
        </Column>
      </Row>
      <GoldButton href={cartUrl}>Complete my order →</GoldButton>
      <Text style={{ marginTop: 20, fontSize: 11, color: C.creamDim }}>This offer expires in 48 hours. Code valid once per customer.</Text>
    </EmailBase>
  );
}
