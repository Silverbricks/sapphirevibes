import * as React from 'react';
import { Text, Section, Hr, Row, Column } from '@react-email/components';
import { EmailBase, GoldButton, Label, BASE_STYLES as C } from './base';

interface OrderItem { productName: string; variantName?: string; quantity: number; unitPrice: number }

interface Props {
  firstName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  shippingCost: number;
  total: number;
  trackingUrl?: string;
  frontendUrl: string;
}

export function OrderConfirmationEmail({ firstName, orderNumber, items, subtotal, gstAmount, shippingCost, total, trackingUrl, frontendUrl }: Props) {
  return (
    <EmailBase preview={`Order ${orderNumber} confirmed — thank you, ${firstName}`}>
      <Text style={{ margin: '0 0 6px', fontSize: 13, color: C.creamDim, letterSpacing: 1 }}>Order confirmed</Text>
      <Text style={{ margin: '0 0 24px', fontSize: 22, fontFamily: 'Georgia, serif', color: C.cream, fontWeight: 400 }}>Thank you, {firstName}</Text>
      <Text style={{ margin: '0 0 20px', fontSize: 14, color: C.creamDim, lineHeight: 1.6 }}>
        Your order <b style={{ color: C.cream }}>{orderNumber}</b> has been confirmed. We'll send you a shipping notification once it's on its way.
      </Text>

      <Label>Order summary</Label>
      <Hr style={{ borderColor: C.line, margin: '8px 0 16px' }} />
      {items.map((item, i) => (
        <Row key={i} style={{ marginBottom: 10 }}>
          <Column><Text style={{ margin: 0, fontSize: 13, color: C.cream }}>{item.productName}{item.variantName ? ` — ${item.variantName}` : ''}</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: 13, color: C.creamDim }}>×{item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}</Text></Column>
        </Row>
      ))}
      <Hr style={{ borderColor: C.line, margin: '16px 0' }} />
      {[
        { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
        { label: 'Shipping', value: shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` },
        { label: 'GST included', value: `$${gstAmount.toFixed(2)}` },
        { label: 'Total (AUD)', value: `$${total.toFixed(2)}`, bold: true },
      ].map(r => (
        <Row key={r.label} style={{ marginBottom: 6 }}>
          <Column><Text style={{ margin: 0, fontSize: 13, color: r.bold ? C.cream : C.creamDim }}>{r.label}</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: 13, color: r.bold ? C.goldBright : C.creamDim, fontWeight: r.bold ? 600 : 400 }}>{r.value}</Text></Column>
        </Row>
      ))}

      <Section style={{ marginTop: 24 }}>
        <GoldButton href={trackingUrl ?? `${frontendUrl}/account/orders`}>
          {trackingUrl ? 'Track your order' : 'View order details'}
        </GoldButton>
      </Section>
    </EmailBase>
  );
}
