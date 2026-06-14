import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailBase, GoldButton, BASE_STYLES as C } from './base';

interface Props { productName: string; productUrl: string; price: number }

export function BackInStockEmail({ productName, productUrl, price }: Props) {
  return (
    <EmailBase preview={`${productName} is back in stock`}>
      <Text style={{ margin: '0 0 6px', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.gold }}>Back in stock</Text>
      <Text style={{ margin: '0 0 24px', fontSize: 22, fontFamily: 'Georgia, serif', color: C.cream, fontWeight: 400 }}>{productName}</Text>
      <Text style={{ margin: '0 0 8px', fontSize: 14, color: C.creamDim, lineHeight: 1.7 }}>
        Great news — the piece you were waiting for is available again. At <b style={{ color: C.goldBright }}>${price.toFixed(2)} AUD</b>, stock is limited so don't wait too long.
      </Text>
      <GoldButton href={productUrl}>Shop now →</GoldButton>
    </EmailBase>
  );
}
